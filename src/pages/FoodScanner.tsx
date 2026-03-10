import { useState, useRef } from "react";
import { Camera, Upload } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ReviewsSection from "@/components/ReviewsSection";

interface NutritionResult {
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

// Simple client-side food estimation based on common foods
const foodDatabase: Record<string, NutritionResult> = {
  chicken: { food: "Grilled Chicken Breast", calories: 284, protein: 53, carbs: 0, fat: 6, fiber: 0 },
  rice: { food: "White Rice (1 cup)", calories: 206, protein: 4, carbs: 45, fat: 0.4, fiber: 1 },
  broccoli: { food: "Broccoli (1 cup)", calories: 55, protein: 4, carbs: 11, fat: 0.6, fiber: 5 },
  egg: { food: "Eggs (2 large)", calories: 143, protein: 13, carbs: 1, fat: 10, fiber: 0 },
  banana: { food: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0.4, fiber: 3 },
  steak: { food: "Steak (6 oz)", calories: 414, protein: 46, carbs: 0, fat: 24, fiber: 0 },
  pasta: { food: "Pasta (1 cup)", calories: 220, protein: 8, carbs: 43, fat: 1.3, fiber: 3 },
  salad: { food: "Mixed Salad", calories: 120, protein: 3, carbs: 12, fat: 7, fiber: 4 },
  sandwich: { food: "Turkey Sandwich", calories: 350, protein: 24, carbs: 36, fat: 12, fiber: 3 },
  oatmeal: { food: "Oatmeal (1 cup)", calories: 154, protein: 5, carbs: 27, fat: 3, fiber: 4 },
  protein: { food: "Protein Shake", calories: 200, protein: 30, carbs: 8, fat: 3, fiber: 1 },
  apple: { food: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4 },
};

const defaultResult: NutritionResult = {
  food: "Estimated Meal",
  calories: 450,
  protein: 28,
  carbs: 42,
  fat: 16,
  fiber: 5,
};

const FoodScanner = () => {
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setAnalyzing(true);
    setResult(null);

    // Simulate analysis
    setTimeout(() => {
      setAnalyzing(false);
      setResult(defaultResult);
    }, 1500);
  };

  const handleManualSearch = () => {
    if (!manualInput.trim()) return;
    setAnalyzing(true);
    setResult(null);
    setImageUrl(null);

    setTimeout(() => {
      const key = manualInput.toLowerCase().trim();
      const match = Object.entries(foodDatabase).find(([k]) => key.includes(k));
      setResult(match ? match[1] : defaultResult);
      setAnalyzing(false);
    }, 800);
  };

  return (
    <div className="page-container">
      <AnimatedSection>
        <h1 className="section-title mb-2">Food Scanner</h1>
        <p className="text-muted-foreground mb-8">Know your fuel. Make weight smart.</p>
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="max-w-xl">
        {/* Upload area */}
        <div
          onClick={() => fileRef.current?.click()}
          className="nav-card flex flex-col items-center justify-center py-16 cursor-pointer group"
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Food" className="max-h-48 object-contain mb-4" />
          ) : (
            <>
              <Camera className="w-12 h-12 text-muted-foreground group-hover:text-gold transition-colors mb-3" />
              <p className="text-muted-foreground text-sm">Upload a photo of your food</p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
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
            className="flex-1 bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
          />
          <button
            onClick={handleManualSearch}
            className="px-6 py-3 bg-primary text-primary-foreground font-heading uppercase text-sm border border-gold hover:bg-gold/90 transition-colors"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>

        {/* Loading */}
        {analyzing && (
          <div className="mt-8 text-center text-muted-foreground text-sm">
            Analyzing your food...
          </div>
        )}

        {/* Results */}
        {result && !analyzing && (
          <AnimatedSection className="mt-8">
            <h3 className="font-heading text-xl uppercase gold-text mb-4">{result.food}</h3>
            <div className="grid grid-cols-2 gap-3">
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
