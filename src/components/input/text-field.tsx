import React, { ChangeEventHandler } from "react";

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
      } px-3 py-2 rounded-md bg-black/10 dark:bg-white/10 outline-none border-transparent focus:border-black/10 dark:focus:border-white/10 border-solid border-2 transition duration-100
      `}
    />
  );
};
