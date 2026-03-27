import React, { useState } from 'react';
import { ArrowLeft, MapPin, Users, X, Settings } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select } from './ui/select';
import { categories, getCategoryById } from '../config/categories';
import { mockMapMarkers, Marker } from '../data/mockMapMarkers';

interface MapViewProps {
    onBack?: () => void;
    onSettings?: () => void;
}

// ...

const MapView: React.FC<MapViewProps> = ({ onBack, onSettings }) => {
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

    const filteredMarkers = mockMapMarkers.filter((marker) => {
        return categoryFilter === "all" || marker.categoryId === categoryFilter;
    });

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4 z-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-700" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-lg font-bold text-slate-800">Community Map</h1>
                            <p className="text-xs text-slate-600">Track issues in your area</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-48">
                            <Select value={categoryFilter} onChange={setCategoryFilter}>
                                <option value="all">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </Select>
                        </div>
                        {onSettings && (
                            <button
                                onClick={onSettings}
                                className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                            >
                                <Settings className="w-5 h-5 text-slate-600" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative overflow-hidden bg-slate-200">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600')] bg-cover bg-center opacity-50 grayscale" />
                <div className="absolute inset-0 bg-blue-900/10" />

                {/* Markers */}
                {filteredMarkers.map((marker) => {
                    const category = getCategoryById(marker.categoryId);
                    const CategoryIcon = category?.icon;

                    return (
                        <button
                            key={marker.id}
                            onClick={() => setSelectedMarker(marker)}
                            className="absolute w-10 h-10 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform flex items-center justify-center border-2 border-white z-0 hover:z-10"
                            style={{
                                top: marker.position.top,
                                left: marker.position.left,
                                backgroundColor: category?.color || "#800020",
                            }}
                        >
                            {CategoryIcon && <CategoryIcon className="w-5 h-5 text-white" />}
                        </button>
                    );
                })}

                {/* Marker Popup */}
                {selectedMarker && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedMarker(null)}>
                        <Card
                            className="w-full max-w-sm p-6 animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-slate-800 text-lg pr-8">{selectedMarker.title}</h3>
                                <button
                                    onClick={() => setSelectedMarker(null)}
                                    className="p-1 hover:bg-slate-100 rounded-full transition-colors absolute top-4 right-4"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {(() => {
                                const category = getCategoryById(selectedMarker.categoryId);
                                const CategoryIcon = category?.icon;
                                return category ? (
                                    <Badge
                                        className="mb-4"
                                        style={{ backgroundColor: category.bgColor, color: category.color }}
                                    >
                                        {CategoryIcon && <CategoryIcon className="w-3 h-3 mr-1" />}
                                        {category.name}
                                    </Badge>
                                ) : null;
                            })()}

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-500">Status</span>
                                    <Badge className={
                                        selectedMarker.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                            selectedMarker.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                'bg-orange-100 text-orange-700'
                                    }>
                                        {selectedMarker.status}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2 text-slate-600">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span>{selectedMarker.location}</span>
                                </div>

                                <div className="flex items-center gap-2 text-slate-600">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    <span>{selectedMarker.votes} Community Votes</span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-green-600">
                                    Vote
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setSelectedMarker(null)}
                                >
                                    Close
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapView;
