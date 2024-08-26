import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-full flex-col p-5 items-center">
        <h1>Home Page</h1>
        <Link href="/dashboard">
          <Button className="mt-4">Start now</Button>
        </Link>
        
    </main>
  );
}
