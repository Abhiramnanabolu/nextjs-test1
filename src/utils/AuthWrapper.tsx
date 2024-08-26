"use client"; // Ensure this component is client-side

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (status === "loading") return; 
    if (!session) {
      router.push("/login"); 
    } else {
      setIsReady(true); // Set ready flag when session is confirmed
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!isReady) {
    return null; // Prevent rendering until the session is confirmed
  }

  return <>{children}</>;
}
