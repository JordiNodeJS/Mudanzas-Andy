// Utility helpers for UI components
export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "md" | "lg";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}) {
  const baseClasses =
    "font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 whitespace-nowrap";

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-[#FAE360] hover:bg-[#f0d84a] text-[#264e70]",
    secondary: "bg-[#679186] hover:bg-[#5a7a6f] text-white",
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 lg:py-4 px-6 lg:px-8 text-base lg:text-lg",
    lg: "py-4 px-8 text-lg",
  };

  const widthClasses = fullWidth ? "w-full sm:w-auto max-w-sm" : "w-auto";

  return cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClasses
  );
}

/**
 * Normalize phone numbers for tel: links.
 * - Removes spaces, parentheses and hyphens
 * - If the number doesn't start with `+` adds the `+34` prefix
 */
export function formatPhoneForTel(phone: string) {
  const clean = phone.replace(/\s+/g, "").replace(/[\(\)\-]/g, "");
  return clean.startsWith("+") ? clean : `+34${clean}`;
}

/**
 * Normalize phone numbers for WhatsApp URLs
 * - Removes spaces, parentheses and hyphens
 * - Ensures the number starts with the country code `34` (without a plus)
 */
export function formatPhoneForWhatsApp(phone: string) {
  const clean = phone.replace(/\s+/g, "").replace(/[\(\)\-]/g, "");
  return clean.startsWith("34") ? clean : `34${clean.replace(/^\+/, "")}`;
}
