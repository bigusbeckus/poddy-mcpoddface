import React, { ChangeEventHandler } from "react";

type TextFieldProps = {
  value?: string | number | readonly string[];
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  className?: string;
};

export const TextField: React.FC<TextFieldProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={`px-3 py-2 rounded-md bg-black/10 dark:bg-white/10 outline-none border-transparent focus:border-black/10 dark:focus:border-white/10 border-solid border-2 transition duration-100 ${
        className ?? ""
      }`}
    />
  );
};
