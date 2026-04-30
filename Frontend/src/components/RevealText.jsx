import React from "react";
import { motion } from "framer-motion";

export default function RevealText({ children, className = "", delay = 0 }) {
  const text = typeof children === "string" ? children : "";
  const characters = text.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.02, delayChildren: delay * i },
    }),
  };

  const childVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.span
      style={{ 
        display: "inline-flex", 
        overflow: "hidden", 
        flexWrap: "wrap",
        paddingBottom: "0.2em",
        marginBottom: "-0.2em"
      }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={childVariants}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
