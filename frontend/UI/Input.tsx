import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  
  className?: string;
  type?:string
  onChange?:(e: React.ChangeEvent<HTMLInputElement>)=>void
  inputValue?:string
  variant?:string
  
}

export const Input = ({
  variant="",
  placeholder = "Enter something...",
  className = "",
  type="text",
  onChange,
  inputValue,
  ...props
}: InputProps) => {
  let baseClasses =
    "w-full rounded-lg border-2 border-gray-300 bg-white bg-opacity-70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300";

  let responsiveClasses =
    "px-4 py-3 text-sm sm:px-5 sm:py-3 sm:text-base md:px-6 md:py-4";

  let placeholderClasses = "placeholder:text-gray-500";

  if(variant === "custom"){
    baseClasses=""
    responsiveClasses=""
    placeholderClasses=""
  }

  return (
    <input
      placeholder={placeholder}
      className={`${baseClasses} ${responsiveClasses} ${placeholderClasses} ${className}`}
      {...props}
      type={type}
      onChange={onChange}
      value={inputValue}
    />
  );
};
