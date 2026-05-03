import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

const DropdownContext = createContext(null);

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
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left" ref={containerRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownMenuTrigger = ({ children, asChild }) => {
  const { open, setOpen } = useContext(DropdownContext);
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  if (asChild) {
    return React.cloneElement(children, { 
      onClick: handleClick 
    });
  }
  return <button onClick={handleClick}>{children}</button>;
};

export const DropdownMenuContent = ({ children, align = "end", className }) => {
  const { open } = useContext(DropdownContext);
  if (!open) return null;

  const alignClass = align === "end" ? "right-0" : "left-0";
  return (
    <div className={cn("absolute z-50 mt-2 min-w-[8rem] overflow-hidden bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]", alignClass, className)}>
      {children}
    </div>
  );
};

export const DropdownMenuItem = ({ children, onClick, className }) => {
  const { setOpen } = useContext(DropdownContext);
  
  const handleClick = (e) => {
    if (onClick) onClick(e);
    setOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      className={cn("w-full text-left px-3 py-2 text-sm hover:bg-zinc-100 flex items-center font-bold transition-colors", className)}
    >
      {children}
    </button>
  );
};

export const DropdownMenuLabel = ({ children, className }) => (
  <div className={cn("px-3 py-2 text-xs font-black text-zinc-950 uppercase tracking-wider", className)}>{children}</div>
);

export const DropdownMenuSeparator = () => <div className="h-[2px] bg-black" />;
