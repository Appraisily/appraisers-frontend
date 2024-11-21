import React from 'react';
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ message }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur z-50">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {message && (
        <p className="mt-4 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;