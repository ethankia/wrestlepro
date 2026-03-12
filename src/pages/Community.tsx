import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Heart, MessageCircle, Send, Image, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import ReviewsSection from "@/components/ReviewsSection";
import { format } from "date-fns";

interface Post {
  id: string;
  user_id: string;
  caption: string;
  hashtags: string[];
  media_url: string | null;
  media_type: string;
  created_at: string;
  profile?: { username: string; avatar_url: string | null };
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profile?: { username: string };
}

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    const { data: postsData } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!postsData) { setLoading(false); return; }

    const enriched = await Promise.all(
      postsData.map(async (post) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("user_id", post.user_id)
          .single();

        const { count: likesCount } = await supabase
          .from("post_likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);

        const { count: commentsCount } = await supabase
          .from("post_comments")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);

        let userLiked = false;
        if (user) {
          const { data: like } = await supabase
            .from("post_likes")
            .select("id")
            .eq("post_id", post.id)
            .eq("user_id", user.id)
            .maybeSingle();
          userLiked = !!like;
        }

        return {
          ...post,
          profile: profile || undefined,
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0,
          user_liked: userLiked,
        };
      })
    );

    setPosts(enriched);
    setLoading(false);
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handlePost = async () => {
    if (!user || (!caption.trim() && !mediaFile)) return;
    setPosting(true);

    try {
      let mediaUrl: string | null = null;
      let mediaType = "image";

      if (mediaFile) {
        mediaType = mediaFile.type.startsWith("video") ? "video" : "image";
        const ext = mediaFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("post-media")
          .upload(path, mediaFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("post-media").getPublicUrl(path);
        mediaUrl = urlData.publicUrl;
      }

      const tags = hashtags
        .split(/[\s,]+/)
        .map((t) => t.replace(/^#/, "").trim())
        .filter(Boolean);

      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        caption: caption.trim(),
        hashtags: tags,
        media_url: mediaUrl,
        media_type: mediaType,
      });

      if (error) throw error;

      setCaption("");
      setHashtags("");
      setMediaFile(null);
      setMediaPreview(null);
      toast.success("Posted!");
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message || "Failed to post");
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) { toast.error("Sign in to like posts"); return; }
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    if (post.user_liked) {
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
    }

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, user_liked: !p.user_liked, likes_count: p.likes_count + (p.user_liked ? -1 : 1) }
          : p
      )
    );
  };

  const loadComments = async (postId: string) => {
    if (expandedComments === postId) { setExpandedComments(null); return; }
    setExpandedComments(postId);
    const { data } = await supabase
      .from("post_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (data) {
      const enriched = await Promise.all(
        data.map(async (c) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("user_id", c.user_id)
            .single();
          return { ...c, profile: profile || undefined };
        })
      );
      setComments(enriched);
    }
  };

  const postComment = async (postId: string) => {
    if (!user) { toast.error("Sign in to comment"); return; }
    if (!commentText.trim()) return;

    const { error } = await supabase.from("post_comments").insert({
      post_id: postId,
      user_id: user.id,
      content: commentText.trim(),
    });

    if (error) { toast.error(error.message); return; }

    setCommentText("");
    loadComments(postId);
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p))
    );
  };

  return (
    <div className="page-container">
      <AnimatedSection>
        <h1 className="section-title mb-2">Community</h1>
        <p className="text-muted-foreground mb-8">Share your grind. Support the team.</p>
      </AnimatedSection>

      {/* Create post */}
      {user ? (
        <AnimatedSection delay={0.1} className="max-w-xl mb-10">
          <div className="nav-card">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind, wrestler?"
              rows={3}
              className="w-full bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none resize-none text-sm"
            />
            {mediaPreview && (
              <div className="relative mt-3">
                {mediaFile?.type.startsWith("video") ? (
                  <video src={mediaPreview} className="max-h-48 rounded" controls />
                ) : (
                  <img src={mediaPreview} alt="Preview" className="max-h-48 rounded object-cover" />
                )}
                <button
                  onClick={() => { setMediaFile(null); setMediaPreview(null); }}
                  className="absolute top-2 right-2 p-1 bg-background/80 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#wrestling #grind #faith"
              className="w-full bg-transparent border-t border-border mt-3 pt-3 text-xs text-muted-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="flex items-center justify-between mt-3">
              <button onClick={() => fileRef.current?.click()} className="text-muted-foreground hover:text-gold transition-colors">
                <Image className="w-5 h-5" />
              </button>
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleMediaSelect} />
              <button
                onClick={handlePost}
                disabled={posting || (!caption.trim() && !mediaFile)}
                className="px-5 py-2 bg-primary text-primary-foreground font-heading uppercase text-xs border border-gold hover:bg-gold/90 transition-colors disabled:opacity-30"
              >
                {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
              </button>
            </div>
          </div>
        </AnimatedSection>
      ) : (
        <AnimatedSection delay={0.1} className="max-w-xl mb-10">
          <div className="nav-card text-center py-8">
            <p className="text-muted-foreground text-sm mb-3">Sign in to post and interact</p>
            <Link to="/auth" className="gold-text font-heading uppercase text-sm hover:underline">
              Sign In →
            </Link>
          </div>
        </AnimatedSection>
      )}

      {/* Posts feed */}
      {loading ? (
        <div className="text-center"><Loader2 className="w-6 h-6 animate-spin gold-text mx-auto" /></div>
      ) : (
        <div className="max-w-xl space-y-6">
          {posts.map((post) => (
            <AnimatedSection key={post.id}>
              <div className="nav-card">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-heading gold-text uppercase">
                    {post.profile?.username?.[0] || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-heading text-foreground">{post.profile?.username || "Wrestler"}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(post.created_at), "MMM d, yyyy")}</p>
                  </div>
                </div>

                {/* Media */}
                {post.media_url && (
                  <div className="mb-3 -mx-6">
                    {post.media_type === "video" ? (
                      <video src={post.media_url} controls className="w-full" />
                    ) : (
                      <img src={post.media_url} alt="" className="w-full object-cover max-h-96" />
                    )}
                  </div>
                )}

                {/* Caption */}
                {post.caption && <p className="text-sm text-foreground mb-2">{post.caption}</p>}
                {post.hashtags?.length > 0 && (
                  <p className="text-xs gold-text mb-3">
                    {post.hashtags.map((t) => `#${t}`).join(" ")}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 border-t border-border pt-3">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${post.user_liked ? "text-mat-red" : "text-muted-foreground hover:text-mat-red"}`}
                  >
                    <Heart className={`w-4 h-4 ${post.user_liked ? "fill-current" : ""}`} />
                    {post.likes_count}
                  </button>
                  <button
                    onClick={() => loadComments(post.id)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {post.comments_count}
                  </button>
                </div>

                {/* Comments */}
                {expandedComments === post.id && (
                  <div className="mt-3 border-t border-border pt-3 space-y-3">
                    {comments.map((c) => (
                      <div key={c.id} className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-heading gold-text uppercase flex-shrink-0">
                          {c.profile?.username?.[0] || "?"}
                        </div>
                        <div>
                          <p className="text-xs font-heading text-foreground">{c.profile?.username || "Wrestler"}</p>
                          <p className="text-xs text-muted-foreground">{c.content}</p>
                        </div>
                      </div>
                    ))}
                    {user && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && postComment(post.id)}
                          placeholder="Add a comment..."
                          className="flex-1 bg-muted px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                        />
                        <button onClick={() => postComment(post.id)} className="text-gold">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
          {posts.length === 0 && (
            <p className="text-center text-muted-foreground text-sm">No posts yet. Be the first!</p>
          )}
        </div>
      )}

      <div className="mt-16">
        <ReviewsSection />
      </div>
    </div>
  );
};

export default Community;
