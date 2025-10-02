import { Router } from "@/router";
import { RootLayout } from "@/components/layouts/RootLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./index.css";

function App() {
    return (
        <ErrorBoundary>
            <RootLayout>
                <Router />
            </RootLayout>
        </ErrorBoundary>
    );
}

export default App;
