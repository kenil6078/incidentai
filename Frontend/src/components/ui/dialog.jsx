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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md relative animate-in zoom-in-95 duration-200">
                <button 
                  onClick={() => onOpenChange(false)}
                  className="absolute -right-3 -top-3 z-10 bg-white border-2 border-black p-1.5 neo-shadow-sm hover:translate-y-0.5 hover:shadow-none transition-all active:scale-90"
                >
                  <X className="w-4 h-4 stroke-[3]" />
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
