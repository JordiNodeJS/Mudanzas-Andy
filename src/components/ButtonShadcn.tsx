import * as React from "react";
import { Button } from "@/components/ui/button";

interface ButtonShadcnProps extends React.ComponentProps<"button"> {
  children: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export function ButtonShadcn({
  children,
  variant = "default",
  size = "default",
  className,
  disabled,
  type = "button",
  onClick,
  ...props
}: ButtonShadcnProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={disabled}
      type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
}
