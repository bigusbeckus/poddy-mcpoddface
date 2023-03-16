import React, { type ChangeEventHandler } from "react";

type TextFieldProps = {
  value?: string | number | readonly string[];
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  className?: string;
  type?: "text" | "password";
};

export const TextField: React.FC<TextFieldProps> = (props) => {
  return (
    <input
      type={props.type ?? "text"}
      value={props.value}
      placeholder={props.placeholder}
      onChange={props.onChange}
      className={`${
        props.className ?? ""
      } rounded-md border-2 border-solid border-transparent bg-black/10 px-3 py-2 outline-none transition duration-100 focus:border-black/10 dark:bg-white/10 dark:focus:border-white/10
      `}
    />
  );
};
