import { Upload, Camera, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export const UploadSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        toast.success("Image uploaded! AI analysis coming soon...");
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a valid image file");
    }
  };

  return (
    <section id="upload-section" className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Start Your Fashion Journey
          </h2>
          <p className="text-lg text-muted-foreground">
            Upload a photo of any outfit you love, and let AI work its magic
          </p>
        </div>

        <Card 
          className={`relative overflow-hidden transition-all duration-300 ${
            isDragging ? "border-accent border-2 shadow-lg scale-[1.02]" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-12">
            {!uploadedImage ? (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                  <Upload className="w-12 h-12 text-accent" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold">Drop your image here</h3>
                  <p className="text-muted-foreground">
                    or click to browse from your device
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <label htmlFor="file-upload">
                    <Button variant="gradient" size="lg" className="cursor-pointer" asChild>
                      <span>
                        <ImageIcon className="mr-2 h-5 w-5" />
                        Choose Image
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                  
                  <Button variant="hero" size="lg">
                    <Camera className="mr-2 h-5 w-5" />
                    Take Photo
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground pt-4">
                  Supports: JPG, PNG, WEBP (Max 10MB)
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-lg overflow-hidden max-w-2xl mx-auto">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded fashion" 
                    className="w-full h-auto"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="gradient" size="lg">
                    Analyze with AI
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setUploadedImage(null)}
                  >
                    Upload Different Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};
