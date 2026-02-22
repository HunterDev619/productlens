'use client';

import { useState } from 'react';

const faqData = [
  {
    question: 'What types of products can Product Lens analyze?',
    answer: 'Product Lens can analyze a wide range of consumer and industrial products including electronics, textiles, packaging, automotive parts, food products, and more. Our AI is continuously trained on new product categories to expand coverage.',
  },
  {
    question: 'How accurate is the carbon footprint calculation?',
    answer: 'Our carbon calculations use verified emission factors from reputable databases including IPCC, EPA, and industry-specific LCA databases. Accuracy typically ranges from 85-95% depending on product complexity and data availability. All sources are cited in reports.',
  },
  {
    question: 'Is the platform compliant with international standards?',
    answer: 'Yes, Product Lens reports comply with ISO 14040 (Life Cycle Assessment), ISO 14067 (Carbon Footprint), and align with IPCC AR6 Synthesis Report methodologies. Our reports are audit-ready for ESG and sustainability disclosures.',
  },
  {
    question: 'Can I integrate Product Lens with my existing systems?',
    answer: 'Professional and Enterprise plans include API access for seamless integration with your ERP, PLM, or sustainability management systems. We also offer custom integrations and webhooks for automated workflows.',
  },
  {
    question: 'How does the EDG grant work for Singapore SMEs?',
    answer: 'The Enterprise Development Grant (EDG) can support up to 50% of qualifying costs for digital transformation projects. Product Lens qualifies as an eligible solution. Our team can assist with grant application documentation and requirements.',
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'We offer tiered support based on your plan: email support for Starter, priority support for Professional, and dedicated account management for Enterprise customers. All plans include comprehensive documentation and training resources.',
  },
];

export function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-24 bg-secondary/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-heading-xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <div
              key={faq.question}
              className="bg-white p-6 mb-4 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => toggleFaq(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-heading font-semibold text-foreground pr-4">{faq.question}</h3>
                <span className="text-2xl text-[#0066ff] font-bold flex-shrink-0">
                  {activeIndex === index ? '−' : '+'}
                </span>
              </div>
              {activeIndex === index && (
                <div className="mt-4 text-body text-muted-foreground leading-relaxed">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

