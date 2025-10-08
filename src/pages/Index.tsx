import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { UploadSection } from "@/components/UploadSection";
import { Footer } from "@/components/Footer";
import fashionBg from "@/assets/fashion-background.jpg";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${fashionBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 0.15
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <Hero />
        <Features />
        <UploadSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
