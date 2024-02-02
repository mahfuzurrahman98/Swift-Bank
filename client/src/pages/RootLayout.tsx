import { ReactNode } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="max-w-6xl w-full mt-5 flex flex-col mx-auto px-4">
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default RootLayout;
