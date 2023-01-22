import { MouseEventHandler } from "react";

type ButtonProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  onClick,
}) => {
  return (
    <button
      className={`px-4 py-2 font-bold transition duration-300 bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-700 dark:hover:bg-indigo-600 rounded-md ${
        className ? className : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
