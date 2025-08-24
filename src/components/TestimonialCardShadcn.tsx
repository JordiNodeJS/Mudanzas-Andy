import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TestimonialCardShadcnProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  location: string;
  text: string;
  rating: number;
}

const renderStars = (rating: number): string => {
  return Array.from({ length: 5 }, (_, i) => (i < rating ? "⭐" : "☆")).join(
    ""
  );
};

export function TestimonialCardShadcn({
  name,
  location,
  text,
  rating,
  className,
  ...props
}: TestimonialCardShadcnProps) {
  return (
    <Card
      className={cn(
        "bg-white/98 backdrop-blur-sm border-[rgba(var(--color-primary),0.1)]",
        className
      )}
      {...props}
    >
      <CardHeader className="pb-3">
        <div className="text-2xl mb-3">{renderStars(rating)}</div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <blockquote className="text-[rgb(var(--color-primary))] text-sm lg:text-base italic">
          "{text}"
        </blockquote>
        <div className="text-[rgb(var(--color-secondary))]">
          <p className="font-semibold text-sm lg:text-base text-[rgb(var(--color-primary))]">
            {name}
          </p>
          <p className="text-xs lg:text-sm text-[rgb(var(--color-secondary))] opacity-90">
            {location}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
