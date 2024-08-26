"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // For redirection

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Redirect to the dashboard if login is successful
        router.push(result.redirect || "/dashboard");
      } else {
        // Handle error response
        setError(result.error || "An unexpected error occurred.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <Card className="p-6 flex flex-col items-center">
        <h1 className="text-slate-900 font-bold text-xl mx-12 mb-6">
          Log in to your Account
        </h1>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full my-1">
            <Label htmlFor="email">Your email address</Label>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full my-1">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full mt-3">
            Submit
          </Button>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </form>
        <Separator className="my-5" />
        <Button
          className="w-full text-sm text-black shadow border flex bg-white hover:bg-white"
          onClick={() => signIn("google")}
        >
          <img
            className="h-full mr-2"
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
          />
          Sign in with Google
        </Button>
        <p className="text-xs mt-4">
          Don&apos;t have an account?{" "}
          <span className="font-semibold text-sky-600 hover:font-bold hover:text-sky-700 hover:underline">
            <Link href="/signup">Sign Up</Link>
          </span>
        </p>
      </Card>
    </main>
  );
}
