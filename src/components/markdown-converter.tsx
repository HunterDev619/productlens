'use client';

import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/utils';

export type MarkdownConverterProps = {
  content: string;
  className?: string;
};

export const MarkdownConverter = ({ content, className }: MarkdownConverterProps) => {
  const convertContent = content.replace(/\n/g, '\n\n');

  const customComponents = {
    h1: ({ children }: { children: React.ReactNode }) => <h1 className="text-2xl font-bold">{children}</h1>,
    h2: ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-bold">{children}</h2>,
    h3: ({ children }: { children: React.ReactNode }) => <h3 className="text-lg font-bold">{children}</h3>,
    h4: ({ children }: { children: React.ReactNode }) => <h4 className="text-base font-bold">{children}</h4>,
    h5: ({ children }: { children: React.ReactNode }) => <h5 className="text-sm font-bold">{children}</h5>,
    h6: ({ children }: { children: React.ReactNode }) => <h6 className="text-xs font-bold">{children}</h6>,
    ul: ({ children }: { children: React.ReactNode }) => <ul className="ml-5 list-disc">{children}</ul>,
    ol: ({ children }: { children: React.ReactNode }) => <ol className="ml-5 list-decimal">{children}</ol>,
    li: ({ children }: { children: React.ReactNode }) => <li className="ml-5 list-disc">{children}</li>,
    p: ({ children }: { children: React.ReactNode }) => <p className="ml-5 list-disc">{children}</p>,
    strong: ({ children }: { children: React.ReactNode }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: { children: React.ReactNode }) => <em className="italic">{children}</em>,
    a: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href} className="text-blue-500 hover:text-blue-700">{children}</a>,
    blockquote: ({ children }: { children: React.ReactNode }) => <blockquote className="ml-5 border-l-4 border-gray-300 pl-4">{children}</blockquote>,
  };

  return (
    <section className={cn('prose prose-lg prose-zinc dark:prose-invert max-w-none text-lg space-y-1', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents as Components}>{convertContent}</ReactMarkdown>
    </section>
  );
};
