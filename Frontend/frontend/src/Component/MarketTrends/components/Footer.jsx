import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-forest-50 dark:bg-forest-950 border-t border-border pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg w-10 h-10 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">CI</span>
              </div>
              <span className="font-bold text-xl">
                <span className="text-forest-700 dark:text-forest-300">Crop</span>
                <span className="text-primary">Insight</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              India's premier agricultural market intelligence platform providing 
              farmers with real-time crop data, price analytics, and market insights.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/trends" className="text-muted-foreground hover:text-primary transition-colors">
                  Crop Trends
                </Link>
              </li>
              <li>
                <Link to="/market" className="text-muted-foreground hover:text-primary transition-colors">
                  Market Analysis
                </Link>
              </li>
              <li>
                <Link to="/insights" className="text-muted-foreground hover:text-primary transition-colors">
                  Insights
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Market Reports
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Crop Calendar
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Government Schemes
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Weather Forecasts
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Agricultural Complex, Krishi Bhavan, New Delhi - 110001, India
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <a href="tel:+911234567890" className="text-muted-foreground hover:text-primary transition-colors">
                  +91 1234 567 890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <a href="mailto:info@cropinsight.in" className="text-muted-foreground hover:text-primary transition-colors">
                  info@cropinsight.in
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground text-sm">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart size={14} className="text-destructive animate-pulse-grow" /> for Indian Farmers
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} CropInsight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;