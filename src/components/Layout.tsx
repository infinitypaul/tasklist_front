import { ReactNode } from 'react';

interface LayoutProps {
    title: string;
    children: ReactNode;
}

const Layout = ({ title, children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-4 px-6 sm:px-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">{title}</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="mt-6 max-w-7xl mx-auto p-6">{children}</main>
        </div>
    );
};

export default Layout;
