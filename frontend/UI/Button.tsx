import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline"|"custom";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
  onClick?:(e:React.MouseEvent<HTMLButtonElement>)=>void
}

export const Button = ({
  variant = "primary",
  children,
  className = "",
  onClick,
  ...props
}:ButtonProps) => {
  let baseClasses =
    "rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Responsive padding and text sizes
  let responsiveClasses = "px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base md:px-5 md:py-2.5";

  let variantClasses = "";

  if (variant === "primary") {
    variantClasses = "bg-blue-600 text-white hover:bg-blue-700 border border-transparent";
  } else if (variant === "secondary") {
    variantClasses = "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-transparent";
  } else if (variant === "outline") {
    variantClasses = "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50";
  }
  else if(variant === 'custom'){
    variantClasses=""
    baseClasses=""
    responsiveClasses=""
  }

  return (
    <button
      className={`${baseClasses} ${responsiveClasses} ${variantClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
