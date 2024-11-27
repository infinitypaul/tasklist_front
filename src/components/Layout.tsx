import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface LayoutProps {
    title: string;
    children: ReactNode;
}

const Layout = ({ title, children }: LayoutProps) => {
    const router = useRouter();

    const handleLogout = () => {
        // Clear the token or any stored authentication data
        localStorage.removeItem('token');
        router.push('/login'); // Redirect to login page
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-4 px-6 sm:px-8 flex justify-between items-center">
                    {/* Logo */}
                    <h1
                        className="text-3xl font-bold leading-tight text-gray-900 cursor-pointer"
                        onClick={() => router.push('/tasks')} // Redirect to dashboard
                    >
                        TaskList
                    </h1>

                    {/* Logout Link */}
                    <button
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="mt-6 max-w-7xl mx-auto p-6">{children}</main>
        </div>
    );
};

export default Layout;
