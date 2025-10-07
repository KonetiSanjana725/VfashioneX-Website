import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/40 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent mb-4">
              VfashioneX
            </h3>
            <p className="text-muted-foreground mb-4">
              Revolutionizing fashion discovery with AI-powered recognition and customization.
            </p>
            <p className="text-sm text-muted-foreground">
              Transform street style into your wardrobe.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-accent transition-colors cursor-pointer">Features</li>
              <li className="hover:text-accent transition-colors cursor-pointer">How It Works</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Pricing</li>
              <li className="hover:text-accent transition-colors cursor-pointer">FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-accent transition-colors cursor-pointer">About</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Blog</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Careers</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Contact</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 VfashioneX. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-accent fill-accent" /> for fashion lovers
          </p>
        </div>
      </div>
    </footer>
  );
};
