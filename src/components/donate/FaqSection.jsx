import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: "Levonható az adómból a támogatás?", a: "Igen, alapítványunk közhasznú szervezet, így a támogatásról adóigazolást tudunk kiállítani. Kérjük, adományozáskor jelezd ezt az igényedet." },
  { q: "Hogyan követhetem nyomon az adományom sorsát?", a: "Rendszeresen közzéteszünk beszámolókat a weboldalunkon és a közösségi média oldalainkon. Havi támogatóinknak e-mailes hírlevelet is küldünk." },
  { q: "Mi történik, ha egy virtuálisan örökbefogadott állatot valaki ténylegesen örökbe fogad?", a: "Ez a legjobb, ami történhet! Ilyenkor értesítünk, és felajánljuk, hogy egy másik, támogatásra szoruló állat virtuális gazdája lehetsz." },
  { q: "Biztonságos a bankkártyás fizetés?", a: "Teljes mértékben. A Stripe, a világ egyik vezető online fizetési szolgáltatója kezeli a tranzakciókat, mi nem tároljuk a kártyaadataidat." },
];

export default function FaqSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Gyakori Kérdések</h2>
          <p className="text-lg text-gray-600 mt-4">Minden, amit a támogatásról tudni érdemes.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg text-left font-semibold hover:no-underline">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-base text-gray-700 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}