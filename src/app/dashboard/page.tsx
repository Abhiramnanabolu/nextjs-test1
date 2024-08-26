"use client"; 

import { Button } from "@/components/ui/button";
import { AuthWrapper } from "@/utils/AuthWrapper";
import Link from "next/link";

function Dashboard() {
  return (
      <main className="flex h-full flex-col p-5 items-center">
        <h1>Dashboard</h1>
        <Link href="/dashboard/settings">
          <Button className="mt-4">Settings</Button>
        </Link>
      </main>
  );
}

export default Dashboard;
