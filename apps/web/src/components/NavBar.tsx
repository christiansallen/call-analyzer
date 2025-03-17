import { useAuth } from "@clerk/clerk-react";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export function NavBar() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return null;
  }

  return (
    <nav className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Call Analyzer
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-800">
                Dashboard
              </Link>
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
