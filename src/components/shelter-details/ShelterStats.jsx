import React from 'react';
import { PawPrint, Users, Calendar, Award } from 'lucide-react';

export default function ShelterStats({ shelter }) {
    const stats = [
        { icon: <PawPrint/>, value: shelter.capacity, label: "Kapacitás" },
        { icon: <Users/>, value: shelter.animals_helped, label: "Segített állat" },
        { icon: <Calendar/>, value: shelter.foundation_year, label: "Alapítva" },
        { icon: <Award/>, value: "Ellenőrzött", label: "Státusz" },
    ];

    return (
        <div className="bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border">
                    {stats.map(stat => (
                        <div key={stat.label}>
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                                {React.cloneElement(stat.icon, { className: "w-6 h-6" })}
                            </div>
                            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}