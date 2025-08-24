import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const serviceCardVariants = cva(
  "transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-opacity-30",
  {
    variants: {
      gradient: {
        primary: "bg-gradient-to-br from-blue-50 to-slate-100",
        secondary: "bg-gradient-to-br from-green-50 to-teal-100",
        accent: "bg-gradient-to-br from-orange-50 to-red-100",
        neutral: "bg-gradient-to-br from-gray-50 to-slate-100",
        custom: "", // Para gradientes personalizados
      },
    },
    defaultVariants: {
      gradient: "primary",
    },
  }
);

interface ServiceCardShadcnProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof serviceCardVariants> {
  icon: string;
  title: string;
  description: string;
  features: string[];
  gradientClass?: string; // Para gradientes custom
}

export function ServiceCardShadcn({
  icon,
  title,
  description,
  features,
  gradient,
  gradientClass,
  className,
  ...props
}: ServiceCardShadcnProps) {
  return (
    <Card
      className={cn(
        serviceCardVariants({ gradient }),
        gradientClass && gradient === "custom" ? gradientClass : "",
        className
      )}
      {...props}
    >
      <CardHeader className="pb-3">
        <div className="text-3xl lg:text-4xl mb-3 lg:mb-4">{icon}</div>
        <CardTitle className="text-lg lg:text-xl font-bold text-[#264e70] mb-2">
          {title}
        </CardTitle>
        <CardDescription className="text-[#679186] text-sm lg:text-base">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs lg:text-sm text-[#264e70] font-semibold">
          <ul className="space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-green-600 flex-shrink-0">✓</span>
                <span className="break-words hyphens-auto">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
