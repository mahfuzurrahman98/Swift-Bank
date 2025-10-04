import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavigationPaths } from "@/utils/enums/navigation-paths";

export default function Page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
            <div className="text-center max-w-2xl px-6">
                <h1 className="text-5xl font-bold mb-6">
                    <span className="text-blue-600">Swift</span>{" "}
                    <span className="text-green-600">Bank</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8">
                    A simple banking simulator to track your expenses and manage your finances
                </p>
                
                <div className="flex gap-4 justify-center">
                    <Link to={NavigationPaths.AUTH_SIGNIN}>
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                            Get Started
                        </Button>
                    </Link>
                    <Link to={NavigationPaths.DASHBOARD}>
                        <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                            Try Demo
                        </Button>
                    </Link>
                </div>
                
                <footer className="mt-16 text-sm text-gray-500">
                    © {new Date().getFullYear()} Swift Bank Simulator
                </footer>
            </div>
        </div>
    );
}
