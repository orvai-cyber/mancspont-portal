import React from 'react';
import { Gift, Heart, Users, Box, Share2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';

import DonateHero from '../components/donate/DonateHero';
import ImpactSection from '../components/donate/ImpactSection';
import DonationForm from '../components/donate/DonationForm';
import VirtualAdoption from '../components/donate/VirtualAdoption';
import OtherWaysToHelp from '../components/donate/OtherWaysToHelp';
import TransparencyReport from '../components/donate/TransparencyReport';
import FaqSection from '../components/donate/FaqSection';

export default function DonatePage() {
  return (
    <div className="bg-white">
      <DonateHero />

      <main>
        <ImpactSection />
        
        <section id="donation-form" className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <DonationForm />
            </motion.div>
          </div>
        </section>

        <VirtualAdoption />

        <OtherWaysToHelp />
        
        <TransparencyReport />

        <FaqSection />

      </main>
    </div>
  );
}