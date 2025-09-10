import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Mennyibe kerül az örökbefogadás?',
    answer: 'Az örökbefogadás általában ingyenes, de néhány menhely kérhet egy kis hozzájárulást (5-15 ezer forint) a védelmi oltások és ivartalanítás költségeihez.'
  },
  {
    question: 'Milyen dokumentumokra van szükség?',
    answer: 'Szükséged lesz személyazonosító okmányra, lakcímkártyára, és néhány menhely kérheti a jövedelmet igazoló dokumentumot is.'
  },
  {
    question: 'Mi történik, ha nem működik a közös élet?',
    answer: 'A legtöbb menhely visszafogadja az állatot, ha nem működik az együttélés. Fontos, hogy ne add tovább másnak, hanem keress fel minket.'
  },
  {
    question: 'Mennyi idő az egész folyamat?',
    answer: 'A jelentkezéstől a hazavitelig általában 1-2 hét telik el, de sürgős esetekben ez lehet rövidebb is.'
  }
];

export default function FaqSection() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-gray-800 flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          Gyakori kérdések
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg">
              <AccordionTrigger className="px-4 py-3 text-left hover:no-underline hover:bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-800 text-left">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 text-gray-600 text-left">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}