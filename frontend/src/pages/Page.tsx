import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { NavigationPaths } from "@/utils/enums/navigation-paths";

export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-gradient-to-br from-primary/10 to-background">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/10 to-primary/20 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                    />
                </div>
                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                                <span className="text-indigo-600">ai</span>
                                <span className="text-amber-500">2</span>
                                <span className="text-emerald-600">ap</span> -
                                Modern Project Management & Collaboration
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                Streamline your projects, connect your teams,
                                and manage your company efficiently
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link to={NavigationPaths.AUTH_SIGNIN}>
                                    <Button
                                        size="lg"
                                        className="bg-primary text-white hover:bg-primary/90"
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                                <Link to={NavigationPaths.DASHBOARD}>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-primary text-primary hover:bg-primary hover:text-white"
                                    >
                                        Banking Demo
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Key Features
                        </h2>
                        <p className="mt-2 text-lg leading-8 text-muted-foreground">
                            Everything you need to manage your projects and
                            teams effectively
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {/* Project Management Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Project Management</CardTitle>
                                    <CardDescription>
                                        Track project progress with stages and
                                        steps
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-primary" />{" "}
                                            Real-time project updates
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-primary" />{" "}
                                            Activity logging
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-primary" />{" "}
                                            Project status tracking
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Team Collaboration Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Team Collaboration</CardTitle>
                                    <CardDescription>
                                        Efficient team communication and
                                        management
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-primary" />{" "}
                                            Integrated chat system
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-primary" />{" "}
                                            File sharing
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-primary" />{" "}
                                            Real-time messaging
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Company Management Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Company Management</CardTitle>
                                    <CardDescription>
                                        Organize and manage your company
                                        effectively
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-primary" />{" "}
                                            Employee management
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-primary" />{" "}
                                            Role-based access control
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-primary" />{" "}
                                            Team organization
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </dl>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-background">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Ready to transform your project management?
                        </h2>
                        <p className="mt-2 text-lg leading-8 text-muted-foreground">
                            Join thousands of companies using Swift Bank to
                            streamline their operations
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link to="/signup">
                                <Button
                                    size="lg"
                                    className="bg-primary text-white hover:bg-primary/90"
                                >
                                    Start Your Free Trial
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-background/50 py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">
                            <span className="text-indigo-600">ai</span>
                            <span className="text-amber-500">2</span>
                            <span className="text-emerald-600">ap</span>
                        </h3>
                        <p className="mt-2 text-muted-foreground">
                            Modern project management and collaboration platform
                        </p>
                        <p className="mt-4 text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Swift Bank. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
