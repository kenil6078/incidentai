import React, { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

export const DropdownMenu = ({ children }) => {
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
    <div className="relative inline-block text-left" ref={containerRef}>
      {React.Children.map(children, (child) => {
        if (child.type === DropdownMenuTrigger) {
          return React.cloneElement(child, { onClick: () => setOpen(!open) });
        }
        if (child.type === DropdownMenuContent) {
          return open ? child : null;
        }
        return child;
      })}
    </div>
  );
};

export const DropdownMenuTrigger = ({ children, asChild, onClick }) => {
  if (asChild) {
    return React.cloneElement(children, { onClick });
  }
  return <button onClick={onClick}>{children}</button>;
};

export const DropdownMenuContent = ({ children, align = "end", className }) => {
  const alignClass = align === "end" ? "right-0" : "left-0";
  return (
    <div className={cn("absolute z-50 mt-2 min-w-[8rem] overflow-hidden bg-white border border-zinc-200 shadow-md", alignClass, className)}>
      {children}
    </div>
  );
};

export const DropdownMenuItem = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={cn("w-full text-left px-3 py-2 text-sm hover:bg-zinc-100 flex items-center", className)}
  >
    {children}
  </button>
);

export const DropdownMenuLabel = ({ children, className }) => (
  <div className={cn("px-3 py-2 text-xs font-semibold text-zinc-500", className)}>{children}</div>
);

export const DropdownMenuSeparator = () => <div className="h-px bg-zinc-200" />;
