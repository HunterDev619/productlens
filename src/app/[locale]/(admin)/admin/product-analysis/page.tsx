import type { Metadata } from 'next';
import { ProductAnalysisPageContent } from './page-content';

export const metadata: Metadata = {
  title: 'Product Analysis',
  description: 'Product Analysis',
};

export default function ProductAnalysisPage() {
  return (
    <div>
      <ProductAnalysisPageContent />
    </div>
  );
}
