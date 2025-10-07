import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";

interface CustomDesignFormProps {
  onSubmit: (data: {
    customizationPrompt: string;
    fabricPreference: string;
    measurements: any;
  }) => void;
  loading: boolean;
}

export const CustomDesignForm = ({ onSubmit, loading }: CustomDesignFormProps) => {
  const [prompt, setPrompt] = useState("");
  const [fabric, setFabric] = useState("");
  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    hips: "",
    length: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      customizationPrompt: prompt,
      fabricPreference: fabric,
      measurements,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Customize Your Design
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="customization">
              Describe Your Desired Changes
            </Label>
            <Textarea
              id="customization"
              placeholder="E.g., Make it blue with shorter sleeves, change the collar to v-neck, add floral patterns..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fabric">Fabric Preference</Label>
            <Select value={fabric} onValueChange={setFabric}>
              <SelectTrigger>
                <SelectValue placeholder="Select fabric type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cotton">Cotton</SelectItem>
                <SelectItem value="silk">Silk</SelectItem>
                <SelectItem value="linen">Linen</SelectItem>
                <SelectItem value="wool">Wool</SelectItem>
                <SelectItem value="polyester">Polyester</SelectItem>
                <SelectItem value="denim">Denim</SelectItem>
                <SelectItem value="leather">Leather</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Measurements (optional)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chest" className="text-sm">Chest (inches)</Label>
                <Input
                  id="chest"
                  type="number"
                  placeholder="36"
                  value={measurements.chest}
                  onChange={(e) =>
                    setMeasurements({ ...measurements, chest: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waist" className="text-sm">Waist (inches)</Label>
                <Input
                  id="waist"
                  type="number"
                  placeholder="30"
                  value={measurements.waist}
                  onChange={(e) =>
                    setMeasurements({ ...measurements, waist: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hips" className="text-sm">Hips (inches)</Label>
                <Input
                  id="hips"
                  type="number"
                  placeholder="38"
                  value={measurements.hips}
                  onChange={(e) =>
                    setMeasurements({ ...measurements, hips: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="length" className="text-sm">Length (inches)</Label>
                <Input
                  id="length"
                  type="number"
                  placeholder="28"
                  value={measurements.length}
                  onChange={(e) =>
                    setMeasurements({ ...measurements, length: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="gradient"
            className="w-full"
            disabled={loading || !prompt}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Custom Design
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
