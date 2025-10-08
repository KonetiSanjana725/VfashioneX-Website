import { Upload, Image as ImageIcon, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AnalysisResults } from "./AnalysisResults";
import { CustomDesignForm } from "./CustomDesignForm";
import { ColorPicker } from "./ColorPicker";

export const UploadSection = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [customDesign, setCustomDesign] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [changingColor, setChangingColor] = useState(false);
  const [customPrice, setCustomPrice] = useState<number>(0);

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

  const handleFile = async (file: File) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to upload images");
      navigate("/auth");
      return;
    }

    if (file && file.type.startsWith("image/")) {
      setUploading(true);
      try {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user!.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('fashion-uploads')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('fashion-uploads')
          .getPublicUrl(fileName);

        // Save to database
        const { data: imageRecord, error: dbError } = await supabase
          .from('uploaded_images')
          .insert({
            user_id: user!.id,
            image_url: publicUrl,
            storage_path: fileName,
            analysis_status: 'pending'
          })
          .select()
          .single();

        if (dbError) throw dbError;

        setUploadedImage(publicUrl);
        toast.success("Image uploaded successfully!");
        
      } catch (error: any) {
        console.error("Upload error:", error);
        toast.error(error.message || "Failed to upload image");
      } finally {
        setUploading(false);
      }
    } else {
      toast.error("Please upload a valid image file");
    }
  };

  const analyzeImage = async () => {
    if (!uploadedImage || !isAuthenticated) return;

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-fashion', {
        body: { imageUrl: uploadedImage }
      });

      if (error) throw error;

      setAnalysisResult(data);
      toast.success("Image analyzed successfully!");

      // Save analysis results to database
      await supabase.from('identified_items').insert({
        upload_id: (await supabase
          .from('uploaded_images')
          .select('id')
          .eq('image_url', uploadedImage)
          .single()).data?.id,
        user_id: user!.id,
        item_name: data.item_name,
        category: data.category,
        description: data.description,
        color: data.color,
        style: data.style,
        ai_confidence: data.confidence,
        product_matches: data.product_matches
      });

    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error(error.message || "Failed to analyze image");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleColorChange = async (color: string, colorName: string) => {
    if (!uploadedImage) return;
    
    setChangingColor(true);
    setSelectedColor(color);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-custom-design', {
        body: {
          customizationPrompt: `Change the color of this outfit to ${colorName}. Keep all other details the same.`,
          originalImageUrl: uploadedImage
        }
      });

      if (error) throw error;

      setCustomDesign(data.imageUrl);
      setCustomPrice(Math.floor(Math.random() * 3000) + 2000);
      toast.success(`Color changed to ${colorName}!`);
      
    } catch (error: any) {
      console.error("Color change error:", error);
      toast.error(error.message || "Failed to change color");
    } finally {
      setChangingColor(false);
    }
  };

  const handleCustomize = async (data: any) => {
    if (!isAuthenticated || !uploadedImage) return;

    setCustomizing(true);
    try {
      const { data: designData, error } = await supabase.functions.invoke('generate-custom-design', {
        body: {
          customizationPrompt: data.customizationPrompt,
          originalImageUrl: uploadedImage
        }
      });

      if (error) throw error;

      setCustomDesign(designData.imageUrl);
      setCustomPrice(Math.floor(Math.random() * 4000) + 3000);
      toast.success("Custom design created!");

      await supabase.from('custom_designs').insert({
        user_id: user!.id,
        original_item_id: analysisResult?.id,
        customization_prompt: data.customizationPrompt,
        custom_image_url: designData.imageUrl,
        modifications: data,
        fabric_preference: data.fabricPreference,
        measurements: data.measurements,
        status: 'completed'
      });

    } catch (error: any) {
      console.error("Customization error:", error);
      toast.error(error.message || "Failed to generate custom design");
    } finally {
      setCustomizing(false);
    }
  };

  const handleOrder = () => {
    navigate("/checkout", {
      state: {
        customDesign,
        price: customPrice
      }
    });
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setShowCustomization(false);
    setCustomDesign(null);
    setSelectedColor("");
    setCustomPrice(0);
  };

  if (!isAuthenticated) {
    return (
      <section id="upload-section" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Sign In to Get Started
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Create an account to upload images and discover fashion with AI
          </p>
          <Button variant="gradient" size="lg" onClick={() => navigate("/auth")}>
            <LogIn className="mr-2 h-5 w-5" />
            Sign In / Sign Up
          </Button>
        </div>
      </section>
    );
  }

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

        {/* Upload Area */}
        {!uploadedImage && (
          <Card 
            className={`relative overflow-hidden transition-all duration-300 ${
              isDragging ? "border-accent border-2 shadow-lg scale-[1.02]" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="p-12">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                  {uploading ? (
                    <Loader2 className="w-12 h-12 text-accent animate-spin" />
                  ) : (
                    <Upload className="w-12 h-12 text-accent" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold">
                    {uploading ? "Uploading..." : "Drop your image here"}
                  </h3>
                  <p className="text-muted-foreground">
                    or click to browse from your device
                  </p>
                </div>

                {!uploading && (
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
                      disabled={uploading}
                    />
                  </div>
                )}

                <p className="text-sm text-muted-foreground pt-4">
                  Supports: JPG, PNG, WEBP (Max 10MB)
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Analysis & Color Picker */}
        {uploadedImage && !showCustomization && (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={customDesign || uploadedImage} 
                  alt="Fashion item" 
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
            </Card>

            {!analysisResult ? (
              <div className="space-y-6">
                <ColorPicker 
                  onColorSelect={handleColorChange}
                  disabled={changingColor}
                  selectedColor={selectedColor}
                />
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="gradient" 
                    size="lg"
                    onClick={analyzeImage}
                    disabled={analyzing || changingColor}
                  >
                    {analyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {analyzing ? "Analyzing..." : "Analyze with AI"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={resetUpload}
                  >
                    Upload Different Image
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <ColorPicker 
                  onColorSelect={handleColorChange}
                  disabled={changingColor}
                  selectedColor={selectedColor}
                />
                <AnalysisResults
                  {...analysisResult}
                  onCustomize={() => setShowCustomization(true)}
                  customPrice={customPrice}
                />
              </>
            )}

            {customDesign && customPrice > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Ready to Order?</h3>
                    <p className="text-3xl font-bold text-accent">
                      ₹{customPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Button variant="gradient" size="lg" onClick={handleOrder}>
                    Order This Design
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Customization Form */}
        {showCustomization && !customDesign && (
          <div className="space-y-6">
            <Button variant="outline" onClick={() => setShowCustomization(false)}>
              ← Back to Results
            </Button>
            <CustomDesignForm onSubmit={handleCustomize} loading={customizing} />
          </div>
        )}

        {/* Custom Design Result */}
        {showCustomization && customDesign && (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={customDesign} 
                  alt="Custom design" 
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Your Custom Design</h3>
                  <p className="text-3xl font-bold text-accent">
                    ₹{customPrice.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button variant="gradient" size="lg" onClick={handleOrder}>
                    Order This Design
                  </Button>
                  <Button variant="outline" size="lg" onClick={resetUpload}>
                    Start Over
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};
