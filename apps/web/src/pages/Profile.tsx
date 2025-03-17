import { useUser } from "@clerk/clerk-react";

export default function Profile() {
  const { user } = useUser();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
        {/* Add more profile information */}
      </div>
    </div>
  );
}
