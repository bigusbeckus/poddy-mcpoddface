import { m } from "framer-motion";

type AnimatedLayoutProps = {
  containerType?: "div" | "span";
  className?: string;
  children: React.ReactNode;
};

export const AnimatedLayout: React.FC<AnimatedLayoutProps> = ({
  children,
  className,
  containerType,
}) => {
  if (containerType === "div") {
    return (
      <m.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.15,
        }}
      >
        {children}
      </m.div>
    );
  }

  return (
    <m.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.15,
      }}
    >
      {children}
    </m.span>
  );
};
