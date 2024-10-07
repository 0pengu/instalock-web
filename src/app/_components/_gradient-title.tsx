import { motion } from "framer-motion";

const text = "Instalock";

const typingVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Controls the speed of typing by staggering each letter
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: "100%" },
  visible: { opacity: 1, y: 0 },
};

export default function GradientTitle() {
  return (
    <motion.span
      variants={typingVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-r from-deep-red-400 to-deep-red-700 text-transparent bg-clip-text inline-flex"
    >
      {text.split("").map((char, index) => (
        <motion.span key={index} variants={letterVariants}>
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
