
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingSection({ pricing }) {
    if (!pricing || pricing.length === 0) {
        return null;
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 bg-white border-slate-200/80 rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-slate-800">
                        <div className="p-2.5 bg-purple-100 rounded-xl">
                            <Award className="w-5 h-5 text-purple-600" />
                        </div>
                        Áraink
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3 divide-y divide-slate-100">
                        {pricing.map((item, index) => (
                            <li key={index} className="flex justify-between items-baseline pt-3 hover:bg-slate-50/80 -mx-4 px-4 rounded-lg transition-colors duration-200">
                                <span className="font-medium text-black">{item.service}</span>
                                <span className="font-normal text-black text-base">
                                    {item.price ? parseInt(String(item.price).replace(/\D/g, ''), 10).toLocaleString('hu-HU') : ''} Ft {item.from_suffix && '-tól'} <span className="text-sm font-normal text-slate-500">{item.unit && `/${item.unit}`}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </motion.div>
    );
}
