import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-fashion.jpg";

export const Hero = () => {
  const scrollToUpload = () => {
    document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Brand Name */}
          <div className="inline-block">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
                VfashioneX
              </span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-muted-foreground font-light max-w-3xl mx-auto">
            Discover, Customize & Order Fashion with AI
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Snap a photo of any outfit you love on the street. Our AI identifies it, finds matches online, or creates a custom version just for you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              variant="gradient" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={scrollToUpload}
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload & Discover
            </Button>
            <Button 
              variant="hero" 
              size="lg"
              className="text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-accent">AI-Powered</div>
              <div className="text-sm text-muted-foreground">Recognition</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-accent">Instant</div>
              <div className="text-sm text-muted-foreground">Matching</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-accent">Custom</div>
              <div className="text-sm text-muted-foreground">Designs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-accent rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-accent rounded-full" />
        </div>
      </div>
    </section>
  );
};
