import { motion } from "framer-motion";

export const AnimatedLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.15,
      }}
    >
      {children}
    </motion.span>
  );
};
