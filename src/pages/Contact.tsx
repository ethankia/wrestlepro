import { Phone, Mail } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ReviewsSection from "@/components/ReviewsSection";

const Contact = () => {
  return (
    <div className="page-container">
      <AnimatedSection>
        <h1 className="section-title mb-2">Contact</h1>
        <p className="text-muted-foreground mb-12">Reach out. We're here.</p>
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="max-w-md">
        <a
          href="sms:6163870268?body=WRESTLE%20BETTER"
          className="nav-card flex items-center gap-4 mb-4 group"
        >
          <Phone className="w-6 h-6 gold-text" />
          <div>
            <p className="text-sm text-muted-foreground">Text</p>
            <p className="text-foreground font-heading text-lg">616-387-0268</p>
          </div>
        </a>

        <a
          href="mailto:ethankia1619@gmail.com"
          className="nav-card flex items-center gap-4 group"
        >
          <Mail className="w-6 h-6 gold-text" />
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-foreground font-heading text-lg">ethankia1619@gmail.com</p>
          </div>
        </a>
      </AnimatedSection>

      <AnimatedSection delay={0.2} className="mt-12 max-w-md text-center">
        <p className="text-sm text-muted-foreground italic">
          "For I know the plans I have for you," declares the Lord. — Jeremiah 29:11
        </p>
      </AnimatedSection>

      <div className="mt-16">
        <ReviewsSection />
      </div>
    </div>
  );
};

export default Contact;
