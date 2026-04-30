import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";

const cn = (...inputs) => twMerge(clsx(inputs));

export const Dialog = ({ children, open, onOpenChange }) => {
  return (
    <>
      {React.Children.map(children, child => {
        if (child.type === DialogTrigger) {
          return React.cloneElement(child, { onClick: () => onOpenChange(true) });
        }
        if (child.type === DialogContent && open) {
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white border border-zinc-200 shadow-xl w-full max-w-md p-6 relative">
                <button 
                  onClick={() => onOpenChange(false)}
                  className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-950"
                >
                  <X className="w-4 h-4" />
                </button>
                {child}
              </div>
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export const DialogTrigger = ({ children, asChild, onClick }) => {
  if (asChild) {
    return React.cloneElement(children, { onClick });
  }
  return <button onClick={onClick}>{children}</button>;
};

export const DialogContent = ({ children, className }) => (
  <div className={cn("space-y-4", className)}>{children}</div>
);

export const DialogHeader = ({ children }) => (
  <div className="space-y-1">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-xl font-bold text-zinc-950">{children}</h2>
);

export const DialogFooter = ({ children }) => (
  <div className="flex justify-end gap-2 pt-4">{children}</div>
);
