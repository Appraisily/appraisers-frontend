import React from 'react';
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ message, size = "default", className = "" }) => {
  // Determine spinner size
  let spinnerSize = "h-8 w-8";
  if (size === "sm") {
    spinnerSize = "h-4 w-4";
  } else if (size === "lg") {
    spinnerSize = "h-12 w-12";
  }

  // For inline spinners without the backdrop
  if (size === "sm" || size === "inline") {
    return (
      <Loader2 className={`${spinnerSize} animate-spin text-primary ${className}`} />
    );
  }

  // Default full-screen spinner with backdrop
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur z-50">
      <Loader2 className={`${spinnerSize} animate-spin text-primary ${className}`} />
      {message && (
        <p className="mt-4 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;