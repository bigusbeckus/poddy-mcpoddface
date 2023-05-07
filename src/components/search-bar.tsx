import { TextField } from "@/components/input/text-field";
import { atom, useAtom } from "jotai";
import { useRouter } from "next/router";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { Search } from "react-feather";

type SearchBarProps = {
  initial?: string;
};

// const searchAtom = atom("");

export const SearchBar: React.FC<SearchBarProps> = () => {
  const [input, setInput] = useState("");
  // const [input, setInput] = useAtom(searchAtom);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (input) {
      router.push(`/search/?q=${encodeURI(input)}`);
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  return (
    <form className="flex" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search"
        value={input}
        onChange={handleInputChange}
        className={`border-r-1 w-96 border-2 border-solid border-transparent border-r-black/30 bg-black/20 px-3 py-2 placeholder-black/70 outline-none backdrop-blur-sm transition duration-150 focus:border-x-black/30 focus:border-y-black/30 dark:border-r-white/5 dark:bg-white/10 dark:placeholder-white/50 dark:focus:border-x-white/10 dark:focus:border-y-white/10`}
      />
      <button
        className={`flex flex-col justify-center border-2 border-l-0 border-solid border-transparent bg-black/20 pl-2 pr-3 backdrop-blur-sm transition-colors hover:bg-black/30 dark:bg-white/10 dark:hover:bg-white/20 dark:active:bg-white/30`}
        type="submit"
      >
        <Search
          size={20}
          className={`inline-block stroke-black transition duration-150 dark:stroke-white ${"opacity-100"}`}
        />
      </button>
    </form>
  );
};
