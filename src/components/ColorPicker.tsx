import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from "lucide-react";

const colors = [
  { name: "Red", hex: "#EF4444", hsl: "0 84% 60%" },
  { name: "Blue", hex: "#3B82F6", hsl: "217 91% 60%" },
  { name: "Green", hex: "#10B981", hsl: "160 84% 39%" },
  { name: "Yellow", hex: "#F59E0B", hsl: "38 92% 50%" },
  { name: "Purple", hex: "#8B5CF6", hsl: "258 90% 66%" },
  { name: "Pink", hex: "#EC4899", hsl: "330 81% 60%" },
  { name: "Orange", hex: "#F97316", hsl: "25 95% 53%" },
  { name: "Black", hex: "#000000", hsl: "0 0% 0%" },
  { name: "White", hex: "#FFFFFF", hsl: "0 0% 100%" },
  { name: "Gray", hex: "#6B7280", hsl: "220 9% 46%" },
  { name: "Brown", hex: "#92400E", hsl: "25 83% 31%" },
  { name: "Beige", hex: "#D4C5B9", hsl: "30 24% 78%" },
  { name: "Navy", hex: "#1E3A8A", hsl: "222 76% 33%" },
  { name: "Maroon", hex: "#7F1D1D", hsl: "0 75% 31%" },
  { name: "Gold", hex: "#D97706", hsl: "38 92% 43%" },
];

interface ColorPickerProps {
  onColorSelect: (color: string, colorName: string) => void;
  disabled?: boolean;
  selectedColor?: string;
}

export const ColorPicker = ({ onColorSelect, disabled, selectedColor }: ColorPickerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-accent" />
          Change Color
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Click any color to change your outfit
        </p>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => onColorSelect(color.hex, color.name)}
              disabled={disabled}
              className={`relative group ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              title={color.name}
            >
              <div 
                className={`w-full aspect-square rounded-lg border-2 transition-all duration-200 ${
                  selectedColor === color.hex 
                    ? 'border-accent ring-2 ring-accent ring-offset-2 scale-110' 
                    : 'border-border hover:border-accent hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};