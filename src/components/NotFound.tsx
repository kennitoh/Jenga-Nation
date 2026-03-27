import React from 'react';
import { Home, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface NotFoundProps {
    onGoHome?: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onGoHome }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>

            <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Page Not Found</h2>

            <p className="text-slate-500 max-w-md mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <Button
                onClick={onGoHome}
                className="bg-[#800020] hover:bg-[#600018] flex items-center gap-2 px-8"
            >
                <Home className="w-4 h-4" /> Go Home
            </Button>
        </div>
    );
};

export default NotFound;
