import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: ReactNode;
  tagline: string;
  children?: ReactNode;
  align?: "left" | "center" | "right";
  variant?: "default" | "compact" | "hero";
  showDivider?: boolean;
}

export function PageHeader({
  title,
  description,
  icon,
  tagline,
  children,
  align = "left",
  variant = "default",
  showDivider = false,
}: PageHeaderProps) {
  // Alignment classes
  const getAlignmentClasses = () => {
    switch (align) {
      case "center":
        return "text-center items-center";
      case "right":
        return "text-right items-end";
      default:
        return "text-left items-start";
    }
  };

  // Variant-specific classes
  const getVariantClasses = () => {
    switch (variant) {
      case "compact":
        return {
          container: "mb-4 sm:mb-6",
          title: "text-2xl sm:text-3xl md:text-4xl",
          description: "text-base sm:text-lg",
          tagline: "px-3 py-1 text-xs sm:text-sm",
          spacing: "space-y-2 sm:space-y-3",
          childrenSpacing: "mt-4 sm:mt-0",
        };
      case "hero":
        return {
          container: "mb-8 sm:mb-10 md:mb-12 lg:mb-16",
          title: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
          description: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
          tagline: "px-4 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base md:text-lg",
          spacing: "space-y-4 sm:space-y-5 md:space-y-6",
          childrenSpacing: "mt-6 sm:mt-8 md:mt-10 lg:mt-12",
        };
      default:
        return {
          container: "mb-6 sm:mb-8 md:mb-10",
          title: "text-3xl sm:text-4xl md:text-5xl",
          description: "text-base sm:text-lg md:text-xl",
          tagline: "px-3 py-1.5 sm:px-4 sm:py-1.5 text-sm sm:text-base",
          spacing: "space-y-3 sm:space-y-4",
          childrenSpacing: "mt-4 sm:mt-0",
        };
    }
  };

  const alignmentClasses = getAlignmentClasses();
  const variantClasses = getVariantClasses();

  return (
    <div className={`relative ${variantClasses.container}`}>
      {/* Optional divider line */}
      {showDivider && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
      )}

      {/* Main container - responsive layout */}
      <div
        className={`flex flex-col ${
          align === "center" ? "lg:flex-col" : "lg:flex-row"
        } justify-between ${
          align === "center" ? "items-center" : "items-start lg:items-center"
        } gap-4 sm:gap-5 md:gap-6 lg:gap-8`}
      >
        {/* Content section */}
        <div
          className={`flex-1 ${alignmentClasses} ${variantClasses.spacing} ${
            children ? "lg:max-w-[70%] xl:max-w-[75%]" : ""
          }`}
        >
          {/* Tagline badge */}
          <div
            className={`inline-flex items-center gap-1.5 sm:gap-2 bg-blue-50 text-blue-600 rounded-full ${
              variantClasses.tagline
            } ${
              align === "center"
                ? "mx-auto"
                : align === "right"
                ? "ml-auto"
                : ""
            }`}
          >
            <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex items-center justify-center">
              {icon}
            </div>
            <span className="font-medium whitespace-nowrap">{tagline}</span>
          </div>

          {/* Title section */}
          <div className={`${alignmentClasses}`}>
            <h1
              className={`font-extrabold leading-tight tracking-tight bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent ${
                variantClasses.title
              } ${
                variant === "hero"
                  ? "drop-shadow-sm"
                  : "drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
              }`}
            >
              {title}
            </h1>
          </div>

          {/* Description */}
          <p
            className={`text-slate-600 leading-relaxed sm:leading-relaxed md:leading-relaxed ${
              variantClasses.description
            } ${
              align === "center"
                ? "mx-auto"
                : align === "right"
                ? "ml-auto"
                : ""
            } ${
              variant === "compact"
                ? "max-w-2xl"
                : variant === "hero"
                ? "max-w-3xl lg:max-w-4xl"
                : "max-w-xl lg:max-w-2xl"
            }`}
          >
            {description}
          </p>
        </div>

        {/* Children/actions section */}
        {children && (
          <div
            className={`flex flex-wrap gap-2 sm:gap-3 ${
              align === "center"
                ? "justify-center w-full"
                : align === "right"
                ? "justify-end lg:justify-end"
                : "justify-start lg:justify-end"
            } ${variantClasses.childrenSpacing} ${
              align === "center" ? "lg:w-full" : "lg:w-auto"
            }`}
          >
            {children}
          </div>
        )}
      </div>

      {/* Background effects for hero variant */}
      {variant === "hero" && (
        <>
          <div className="absolute -top-4 -left-4 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-blue-100/30 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-cyan-100/30 rounded-full blur-3xl -z-10" />
        </>
      )}
    </div>
  );
}

// Alternative: Simplified responsive version
export function SimplePageHeader({
  title,
  description,
  icon,
  tagline,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
      {/* Left content */}
      <div className="space-y-2 sm:space-y-3 flex-1 max-w-3xl">
        {/* Tagline badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-50 text-blue-600 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium">
          <div className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center">
            {icon}
          </div>
          <span>{tagline}</span>
        </div>

        {/* Title and description */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight sm:leading-tight md:leading-[1.1] tracking-tight bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-2 sm:mt-3 md:mt-4 max-w-xl sm:max-w-2xl leading-relaxed sm:leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Right content - actions */}
      {children && (
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-start lg:justify-end lg:self-start lg:mt-12">
          {children}
        </div>
      )}
    </div>
  );
}

// Alternative: Center aligned version for landing pages
export function CenteredPageHeader({
  title,
  description,
  icon,
  tagline,
  children,
}: PageHeaderProps) {
  return (
    <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-12 lg:mb-16">
      {/* Tagline badge */}
      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-sm sm:text-base font-medium mb-4 sm:mb-6">
        <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
          {icon}
        </div>
        <span>{tagline}</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight sm:leading-tight md:leading-[1.1] tracking-tight bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent mb-4 sm:mb-6">
        {title}
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg md:text-xl text-slate-600 mx-auto max-w-xl sm:max-w-2xl md:max-w-3xl leading-relaxed sm:leading-relaxed mb-6 sm:mb-8">
        {description}
      </p>

      {/* Children/actions */}
      {children && (
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
          {children}
        </div>
      )}
    </div>
  );
}