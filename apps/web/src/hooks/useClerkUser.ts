import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

export function useClerkUser() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded && userId && user) {
      const syncUser = async () => {
        await fetch("http://localhost:3001/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userId,
            email: user.primaryEmailAddress?.emailAddress || "",
          }),
        });
      };

      syncUser().catch(console.error);
    }
  }, [isLoaded, userId, user]);

  return { isLoaded, userId, user };
}
