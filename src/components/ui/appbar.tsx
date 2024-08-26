import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Assuming you've installed the js-cookie library

const clearAuthToken = () => {
  Cookies.remove("auth_token");
};

export default function Appbar() {
  const { data: session } = useSession();
  const [hasToken, setHasToken] = useState(false); // Initialize with a default value
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      return Cookies.get("auth_token") !== undefined;
    };

    setHasToken(checkToken());
  }, []);

  const handleSignOut = async () => {
    try {
      if (session) {
        signOut({ callbackUrl: '/', redirect:true });
      } else {
        clearAuthToken();
        setHasToken(false);
      }
      // Redirect to the root path regardless of the current route
      router.replace("/");
    } catch (error) {
      console.error("Sign-out error:", error);
      // Handle the error appropriately, e.g., show an error message
    }
  };

  useEffect(() => {
    console.log("Session:", session);
    console.log("Has Token:", hasToken);
  }, [session, hasToken]);

  return (
    <div className="w-full flex justify-between px-4 py-3 shadow">
      <h1 className="text-xl font-bold">My-App</h1>
      {session?.user || hasToken ? (
        <div>
          <Button onClick={handleSignOut} size={"sm"}>
            Sign Out
          </Button>
        </div>
      ) : (
        <div>
          <Link href={"/login"}>
            <Button className="mr-2" size={"sm"}>
              Log In
            </Button>
          </Link>
          <Link href={"/signup"}>
            <Button size={"sm"}>Sign Up</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
