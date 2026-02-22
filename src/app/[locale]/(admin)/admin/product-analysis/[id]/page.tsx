import type { Metadata } from 'next';
import { ProductAnalysisDetailPageContent } from './page-content';

export const metadata: Metadata = {
  title: 'Product Analysis Detail',
  description: 'Product Analysis Detail',
};

export default function ProductAnalysisDetailPage() {
  return (
    <div>
      <ProductAnalysisDetailPageContent />
    </div>
  );
}
