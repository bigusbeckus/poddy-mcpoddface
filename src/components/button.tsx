import type { MouseEventHandler } from "react";

type ButtonProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const Button: React.FC<ButtonProps> = ({ className, children, onClick }) => {
  return (
    <button
      className={`rounded-md bg-indigo-300 px-4 py-2 font-bold transition duration-300 hover:bg-indigo-400 dark:bg-indigo-700 dark:hover:bg-indigo-600 ${
        className ? className : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
