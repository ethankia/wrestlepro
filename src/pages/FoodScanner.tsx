import { useState, useRef } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AnimatedSection from "@/components/AnimatedSection";
import ReviewsSection from "@/components/ReviewsSection";

interface NutritionResult {
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  items?: string[];
}

const FoodScanner = () => {
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const analyzeWithAI = async (imageBase64?: string, foodText?: string) => {
    setAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("scan-food", {
        body: { imageBase64, foodText },
      });

      if (error) {
        throw new Error(error.message || "Failed to analyze food");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err: any) {
      console.error("Food scan error:", err);
      toast.error(err.message || "Failed to analyze food. Try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageUrl(url);

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      analyzeWithAI(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleManualSearch = () => {
    if (!manualInput.trim()) return;
    setImageUrl(null);
    analyzeWithAI(undefined, manualInput.trim());
  };

  return (
    <div className="page-container">
      <AnimatedSection>
        <h1 className="section-title mb-2">Food Scanner</h1>
        <p className="text-muted-foreground mb-2">Know your fuel. Make weight smart.</p>
        <p className="text-xs text-muted-foreground mb-8">Powered by AI — upload a photo or type a food name.</p>
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="max-w-xl">
        {/* Upload area */}
        <div
          onClick={() => !analyzing && fileRef.current?.click()}
          className={`nav-card flex flex-col items-center justify-center py-12 md:py-16 cursor-pointer group ${analyzing ? "opacity-60 cursor-wait" : ""}`}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Food" className="max-h-48 object-contain mb-4 rounded" />
          ) : (
            <>
              <Camera className="w-12 h-12 text-muted-foreground group-hover:text-gold transition-colors mb-3" />
              <p className="text-muted-foreground text-sm">Upload a photo of your food</p>
              <p className="text-muted-foreground text-xs mt-1">JPG, PNG — tap or click</p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Manual input */}
        <div className="mt-6 flex gap-3">
          <input
            type="text"
            placeholder="Or type a food (e.g. chicken, rice, banana)"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
            disabled={analyzing}
            className="flex-1 bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold disabled:opacity-50"
          />
          <button
            onClick={handleManualSearch}
            disabled={analyzing || !manualInput.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground font-heading uppercase text-sm border border-gold hover:bg-gold/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          </button>
        </div>

        {/* Loading */}
        {analyzing && (
          <div className="mt-8 text-center">
            <Loader2 className="w-6 h-6 animate-spin gold-text mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">Analyzing your food with AI...</p>
          </div>
        )}

        {/* Results */}
        {result && !analyzing && (
          <AnimatedSection className="mt-8">
            <h3 className="font-heading text-xl uppercase gold-text mb-2">{result.food}</h3>
            {result.items && result.items.length > 1 && (
              <p className="text-xs text-muted-foreground mb-4">
                Detected: {result.items.join(", ")}
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Calories", value: result.calories, unit: "kcal" },
                { label: "Protein", value: result.protein, unit: "g" },
                { label: "Carbs", value: result.carbs, unit: "g" },
                { label: "Fat", value: result.fat, unit: "g" },
                { label: "Fiber", value: result.fiber, unit: "g" },
              ].map((item) => (
                <div key={item.label} className="nav-card text-center">
                  <p className="text-2xl font-heading gold-text">
                    {item.value}
                    <span className="text-sm text-muted-foreground ml-1">{item.unit}</span>
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}
      </AnimatedSection>

      <div className="mt-16">
        <ReviewsSection />
      </div>
    </div>
  );
};

export default FoodScanner;
