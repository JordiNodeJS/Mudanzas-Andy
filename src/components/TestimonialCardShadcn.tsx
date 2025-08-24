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
        "bg-white/98 backdrop-blur-sm border-[#264e70]/10",
        className
      )}
      {...props}
    >
      <CardHeader className="pb-3">
        <div className="text-2xl mb-3">{renderStars(rating)}</div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <blockquote className="text-[#264e70] text-sm lg:text-base italic">
          "{text}"
        </blockquote>
        <div className="text-[#679186]">
          <p className="font-semibold text-sm lg:text-base text-[#264e70]">
            {name}
          </p>
          <p className="text-xs lg:text-sm text-[#679186] opacity-90">
            {location}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
