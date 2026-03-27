import React, { useState } from 'react';
import { FileText, Map, Newspaper, HelpCircle, Shield, Plus, X } from 'lucide-react';
import { Screen } from '../types';
import { Button } from './ui/button';

interface FloatingActionsProps {
    onNavigate: (screen: Screen) => void;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        { id: 'report', icon: FileText, label: 'Report Issue', color: 'bg-red-500' },
        { id: 'map', icon: Map, label: 'Map View', color: 'bg-blue-500' },
        { id: 'support', icon: HelpCircle, label: 'Support', color: 'bg-green-500' },
    ];

    return (
        <div className="fixed bottom-20 right-4 flex flex-col items-end gap-3 z-40">
            {isOpen && (
                <div className="flex flex-col gap-3 mb-2">
                    {actions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <div key={action.id} className="flex items-center gap-3">
                                <span className="bg-white px-3 py-1 rounded-lg shadow-sm text-sm font-medium">
                                    {action.label}
                                </span>
                                <button
                                    onClick={() => {
                                        onNavigate(action.id as Screen);
                                        setIsOpen(false);
                                    }}
                                    className={`${action.color} text-white p-3 rounded-full shadow-lg hover:opacity-90 transition-opacity`}
                                >
                                    <Icon className="w-5 h-5" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full w-14 h-14 p-0 shadow-lg bg-primary-600 hover:bg-primary-700 text-white"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </Button>
        </div>
    );
};

export default FloatingActions;
