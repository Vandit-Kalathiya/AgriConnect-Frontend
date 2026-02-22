import React from "react";
import { cn } from "../lib/utils";

const AnimatedBackground = ({ className }) => {
  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-jewel-50 to-white"></div>

      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-jewel-100/30 to-transparent"></div>

      {/* Radial gradients for dimension */}
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.08),transparent_35%)]"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_35%)]"></div>

      {/* Blur effect */}
      <div className="absolute inset-0 backdrop-blur-[100px] bg-transparent"></div>

      {/* Animated floating elements */}
      <div className="absolute top-20 left-[20%] w-64 h-64 rounded-full bg-jewel-200/20 mix-blend-multiply blur-3xl animate-float"></div>
      <div
        className="absolute bottom-20 right-[20%] w-80 h-80 rounded-full bg-jewel-200/20 mix-blend-multiply blur-3xl animate-float"
        style={{ animationDelay: "-2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-200/10 mix-blend-multiply blur-3xl animate-float"
        style={{ animationDelay: "-4s" }}
      ></div>

      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>

      {/* Subtle patterns for texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzc3IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDIiPjxwYXRoIGQ9Ik0tMTAgMTBsMjAgLTIwTTAgMGgyMEwwIDIwTTEwIC0xMGwyMCAyME0zMCAtMTBsMjAgMjBNLTEwIDMwbDIwIC0yME0tMTAgNTBsMjAgLTIwTTUwIC0xMGwyMCAyME0zMCA1MGwyMCAtMjAiLz48L2c+PC9zdmc+')] opacity-40"></div>
    </div>
  );
};

export default AnimatedBackground;
