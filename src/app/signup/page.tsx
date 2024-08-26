"use client";  // Ensure this is at the top of the file

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Updated import for Next.js 13

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An unexpected error occurred");
      } else {
        setSuccess("Sign up successful. You can now log in.");
        setTimeout(() => {
          router.push(data.redirect || "/dashboard");
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <Card className="p-6 flex flex-col items-center">
        <h1 className="text-slate-900 font-bold text-xl mx-12 mb-6">
          Sign up for an Account
        </h1>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full my-1">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(""); // Clear error on input change
                setSuccess(""); // Clear success on input change
              }}
            />
          </div>
          <div className="w-full my-1">
            <Label htmlFor="email">Your email address</Label>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(""); // Clear error on input change
                setSuccess(""); // Clear success on input change
              }}
            />
          </div>
          <div className="w-full my-1">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(""); // Clear error on input change
                setSuccess(""); // Clear success on input change
              }}
            />
          </div>
          <div className="w-full my-1">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(""); // Clear error on input change
                setSuccess(""); // Clear success on input change
              }}
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
          <Button type="submit" className="w-full mt-3">
            Submit
          </Button>
        </form>
        <Separator className="my-5" />
        <Button
          className="w-full text-sm text-black shadow border flex bg-white hover:bg-white"
          onClick={() => signIn("google")}
        >
          <img
            className="h-full mr-2"
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
            alt="Google Logo"
          />
          Sign up with Google
        </Button>
        <p className="text-xs mt-4">
          Already have an Account?{" "}
          <span className="font-semibold text-sky-600 hover:font-bold hover:text-sky-700 hover:underline">
            <Link href="/login">Log in</Link>
          </span>
        </p>
      </Card>
    </main>
  );
}
