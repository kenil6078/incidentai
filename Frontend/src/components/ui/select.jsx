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
  <div className={cn("absolute z-50 mt-1 max-h-60 w-full overflow-auto border border-zinc-200 bg-white shadow-md", className)}>
    <div className="p-1">
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
      "relative flex w-full cursor-default select-none items-center py-1.5 px-2 text-sm outline-none hover:bg-zinc-100 focus:bg-zinc-100",
      className
    )}
  >
    {children}
  </button>
);
