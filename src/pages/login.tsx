import type { NextPage } from "next";
import Link from "next/link";
import { type ChangeEvent, useState } from "react";
import { Button } from "@/components/button";
import { TextField } from "@/components/input/text-field";
import { AnimatedLayout } from "@/layouts/animated";

const LoginPage: NextPage = () => {
  // const [showPasswordField, setShowPasswordField] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailOnChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  return (
    <AnimatedLayout>
      <div className="flex h-full items-center justify-center">
        <div className="rounded-md p-12 outline outline-1 outline-white/10">
          <div>
            <h1 className="text-center text-3xl font-bold">Log in to Podcasts</h1>
          </div>
          <div className="mt-10 grid grid-cols-1 justify-center gap-y-2">
            <div className="col-span-full">
              <TextField
                value={email}
                onChange={handleEmailOnChange}
                className="w-full text-lg"
                placeholder="Email address"
              />
            </div>
            <div>
              <TextField
                value={password}
                onChange={handlePasswordChange}
                className="w-full text-lg"
                placeholder="Password"
                type="password"
              />
            </div>
          </div>
          <Button className="mt-10 w-full dark:bg-green-900 dark:hover:bg-green-800">Login</Button>
          <div className="mt-32 text-center">
            <Link href="/signup">
              <a className="text-emerald-300 hover:underline">
                Don&apos;t have an account? Sign Up
              </a>
            </Link>
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
};

export default LoginPage;
