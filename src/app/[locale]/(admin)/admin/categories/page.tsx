import type { Metadata } from 'next';
import CategoriesPageContent from './page-content';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Categories',
};

export default function CategoriesPage() {
  return (
    <div>
      <CategoriesPageContent />
    </div>
  );
}
