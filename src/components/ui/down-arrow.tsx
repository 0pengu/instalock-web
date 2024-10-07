"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa6";

export function DownArrow() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    };
    addEventListener("scroll", handleScroll);

    return () => {
      removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <motion.div
      className="fixed bottom-0 right-1/2 py-4 rounded-full z-50"
      animate={{
        y: [0, -10, 0, 20, 0],
      }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      hidden={hidden}
    >
      <FaCaretDown />
    </motion.div>
  );
}
