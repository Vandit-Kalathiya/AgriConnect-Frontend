import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Separator } from "./ui/Separator";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  LineChartIcon,
  InfoIcon,
} from "lucide-react";
import { cn } from "../lib/utils";

const CropCard = ({ crop, index, onSelect }) => {
  const getMarketTrendColor = (trend) => {
    switch (trend) {
      case "rising":
        return "text-emerald-500";
      case "stable":
        return "text-amber-500";
      case "falling":
        return "text-rose-500";
      default:
        return "text-gray-500";
    }
  };

  const getMarketTrendIcon = (trend) => {
    switch (trend) {
      case "rising":
        return <ArrowUpIcon className="h-4 w-4" />;
      case "stable":
        return <TrendingUpIcon className="h-4 w-4" />;
      case "falling":
        return <ArrowDownIcon className="h-4 w-4" />;
      default:
        return <LineChartIcon className="h-4 w-4" />;
    }
  };

  const getSuitabilityColor = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-lime-500";
    if (score >= 40) return "bg-amber-500";
    if (score >= 20) return "bg-orange-500";
    return "bg-rose-500";
  };

  return (
    <Card
      className={cn(
        "hover-lift cursor-pointer overflow-hidden transition-all duration-300",
        "border-0 glass-card shadow-sm"
      )}
      onClick={() => onSelect(crop)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="absolute top-0 left-0 w-full h-1 flex">
        <div
          className={cn(getSuitabilityColor(crop.suitabilityScore), "h-full")}
          style={{ width: `${crop.suitabilityScore}%` }}
        ></div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{crop.name}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {crop.description}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "ml-2 flex items-center gap-1 font-medium",
              getMarketTrendColor(crop.marketTrend)
            )}
          >
            {getMarketTrendIcon(crop.marketTrend)}
            {crop.marketTrend.charAt(0).toUpperCase() +
              crop.marketTrend.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-3 text-sm mt-2">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Growing Season</span>
            <span className="font-medium">{crop.growingSeason}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Water Need</span>
            <span className="font-medium capitalize">
              {crop.waterRequirement}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Harvest Period</span>
            <span className="font-medium">{crop.harvestTime}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Est. ROI</span>
            <span
              className={cn(
                "font-medium",
                crop.estimatedROI > 15
                  ? "text-emerald-600"
                  : crop.estimatedROI > 5
                  ? "text-amber-600"
                  : "text-rose-600"
              )}
            >
              {crop.estimatedROI}%
            </span>
          </div>
          <div className="flex flex-col col-span-2">
            <span className="text-muted-foreground">Soil Types</span>
            <span className="font-medium">{crop.soilType.join(", ")}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <InfoIcon className="h-4 w-4" />
            <span>Recommended Resources</span>
          </div>
          <ul className="mt-1 text-sm space-y-1">
            {crop.resources.map((resource, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2 text-emerald-500">•</span>
                <span>{resource}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <Separator className="mb-3" />

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full text-sm">
          <div className="flex items-center">
            <span className="text-muted-foreground mr-2">
              Suitability Score:
            </span>
            <span className="font-semibold">{crop.suitabilityScore}%</span>
          </div>
          <div className="flex items-center">
            <span className="text-muted-foreground mr-2">Price Trend:</span>
            <span
              className={cn(
                "font-semibold",
                crop.marketPriceChange > 0
                  ? "text-emerald-600"
                  : crop.marketPriceChange === 0
                  ? "text-amber-600"
                  : "text-rose-600"
              )}
            >
              {crop.marketPriceChange > 0 ? "+" : ""}
              {crop.marketPriceChange}%
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CropCard;
