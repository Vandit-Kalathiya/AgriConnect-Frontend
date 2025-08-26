import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "../components/ui/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-muted/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🌱</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Oops! This crop couldn't be found in our fields.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </Button>
            <Link to="/">
              <Button className="flex items-center gap-2 w-full sm:w-auto">
                <Home size={16} />
                <span>Return Home</span>
              </Button>
            </Link>
          </div>
          <div className="mt-12">
            <p className="text-muted-foreground">
              Looking for something specific? Try using the search bar at the top.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;