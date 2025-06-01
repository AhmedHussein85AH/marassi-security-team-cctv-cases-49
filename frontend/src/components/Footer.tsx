import { Heart, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background py-3 text-center">
      <div className="container flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Made with</span>
        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
        <span>by Ahmed Hussein</span>
        <span className="mx-2">|</span>
        <Phone className="h-4 w-4" />
        <a 
          href="tel:+201552962516"
          className="hover:text-primary transition-colors"
        >
          +201552962516
        </a>
        <span className="mx-2">|</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
};

export default Footer; 