import { Sparkles, Search, Palette, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import aiFeatureImg from "@/assets/ai-feature.jpg";
import customizationImg from "@/assets/customization.jpg";

const features = [
  {
    icon: Sparkles,
    title: "AI Recognition",
    description: "Snap any outfit on the street. Our AI instantly identifies brands, styles, and products.",
    image: aiFeatureImg,
  },
  {
    icon: Search,
    title: "Smart Matching",
    description: "Find exact matches or similar items from thousands of online stores in seconds.",
    gradient: "from-purple-500 to-blue-500",
  },
  {
    icon: Palette,
    title: "Custom Design",
    description: "Can't find it? Describe changes—color, sleeves, fabric—and AI creates your custom design.",
    image: customizationImg,
  },
  {
    icon: ShoppingBag,
    title: "Direct to Doorstep",
    description: "Order your perfect outfit with measurements and fabric preferences. We handle the rest.",
    gradient: "from-pink-500 to-accent",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How VfashioneX Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to get the outfit of your dreams
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-accent/50"
            >
              <CardContent className="p-0">
                {feature.image ? (
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-3">
                        <feature.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ) : (
                  <div className={`relative h-64 bg-gradient-to-br ${feature.gradient} p-6 flex flex-col justify-end`}>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/90">{feature.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
