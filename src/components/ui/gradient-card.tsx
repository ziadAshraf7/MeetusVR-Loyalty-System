import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import React from "react";

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: "primary" | "gold" | "card";
  glow?: boolean;
}

export const GradientCard = ({ 
  className, 
  gradient = "card", 
  glow = false,
  ...props 
}: GradientCardProps) => {
  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:scale-[1.02]",
        gradient === "primary" && "bg-gradient-primary text-primary-foreground",
        gradient === "gold" && "bg-gradient-gold text-accent-foreground",
        gradient === "card" && "bg-gradient-card",
        glow && "shadow-glow",
        !glow && "shadow-card",
        className
      )}
      {...props}
    />
  );
};