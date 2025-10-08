import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Sparkles } from "lucide-react";

interface ProductMatch {
  name: string;
  brand: string;
  price: string;
  url: string;
  similarity: number;
}

interface AnalysisResultsProps {
  itemName: string;
  category: string;
  description: string;
  color: string;
  style: string;
  confidence: number;
  productMatches: ProductMatch[];
  onCustomize: () => void;
}

export const AnalysisResults = ({
  itemName,
  category,
  description,
  color,
  style,
  confidence,
  productMatches,
  onCustomize,
}: AnalysisResultsProps) => {
  return (
    <div className="space-y-6">
      {/* Main Item Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            AI Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">{itemName}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="secondary">{color}</Badge>
            <Badge variant="secondary">{style}</Badge>
            <Badge variant="outline">
              {Math.round(confidence * 100)}% confident
            </Badge>
          </div>

          <Button onClick={onCustomize} variant="gradient" className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Customize This Design
          </Button>
        </CardContent>
      </Card>

      {/* Product Matches */}
      {productMatches && productMatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Similar Products Online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {productMatches.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-accent transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {product.brand}
                    </p>
                    <p className="text-sm font-medium text-accent mt-1">
                      {product.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {Math.round(product.similarity * 100)}% match
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(product.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
