import React, { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "lucide-react";

const cn = (...inputs) => twMerge(clsx(inputs));

export const Select = ({ children, value, onValueChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { 
            onClick: () => setOpen(!open),
            value: value
          });
        }
        if (child.type === SelectContent) {
          return open ? React.cloneElement(child, { 
            onSelect: (v) => {
              onValueChange(v);
              setOpen(false);
            }
          }) : null;
        }
        return child;
      })}
    </div>
  );
};

export const SelectTrigger = ({ className, value, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex h-10 w-full items-center justify-between border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-zinc-950 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
  >
    <span>{value}</span>
    <ChevronDown className="h-4 w-4 opacity-50" />
  </button>
);

export const SelectValue = ({ placeholder }) => null; // Not needed in this simple implementation

export const SelectContent = ({ children, onSelect, className }) => (
  <div className={cn(
    "absolute z-50 mt-2 max-h-60 w-full overflow-hidden border-2 border-black bg-white neo-shadow-md animate-in fade-in slide-in-from-top-2 duration-200", 
    className
  )}>
    <div className="p-1.5 bg-grid-bg">
      {React.Children.map(children, (child) => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, { onSelect });
        }
        return child;
      })}
    </div>
  </div>
);

export const SelectItem = ({ children, value, onSelect, className }) => (
  <button
    type="button"
    onClick={() => onSelect(value)}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center py-2 px-3 text-sm outline-none transition-colors hover:bg-zinc-950 hover:text-white focus:bg-zinc-950 focus:text-white font-bold",
      className
    )}
  >
    {children}
  </button>
);
