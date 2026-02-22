'use client';

import type { ProductSpecificationDetail } from '@/services/product-specifications/detail';
import { Calendar, Globe, Package, Star } from 'lucide-react';

import Image from 'next/image';
import { Badge } from '@/components/ui/components/badge';
import { useImageUrl } from '@/services/images/use-image-url';

type ProductOverviewProps = {
  data: ProductSpecificationDetail;
  formatPrice: (prices: string[]) => string;
  formatDate: (dateString: string) => string;
};

export default function ProductOverview({
  data,
  formatPrice,
  formatDate,
}: ProductOverviewProps) {
  const imageUrl = useImageUrl(data.imageId);

  return (
    <div className="rounded-xl border bg-white p-8 shadow-sm">
      {/* Product Image */}
      {data.image?.imageKey && (
        <div className="relative mb-6 h-64 w-full">
          <Image
            src={imageUrl || '/assets/images/no-image.webp'}
            alt={data.productName}
            fill
            className="rounded-lg object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {data.productName}
          </h2>
          <p className="text-gray-600">{data.manufacturer}</p>
          <p className="text-sm text-gray-500">{data.productGeneralName}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Price Range</p>
          <p className="text-2xl font-bold text-green-600">
            {formatPrice(data.marketPrice)}
          </p>
          <div className="mt-1 flex items-center justify-end text-sm text-gray-500">
            <Star className="mr-1 h-4 w-4 text-yellow-500" />
            Confidence:
            {' '}
            {(Number.parseFloat(data.confidenceScore) * 100).toFixed(0)}
            %
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-gray-700">Categories</p>
        <div className="flex flex-wrap gap-2">
          {data.categoryName.map((category: string) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
          <Package className="h-5 w-5 text-purple-600" />
          <div>
            <p className="text-sm font-medium text-gray-700">Weight</p>
            <p className="text-gray-900">
              {data.totalWeight}
              {' '}
              {data.totalWeightUnit}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
          <Globe className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-700">Origin</p>
            <p className="text-gray-900">{data.origin}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
          <Calendar className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-gray-700">Lifespan</p>
            <p className="text-gray-900">
              {data.lifespan}
              {' '}
              years
            </p>
          </div>
        </div>
      </div>

      {/* SKU and Timestamps */}
      <div className="mt-6 grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-gray-700">SKU Number</p>
          <p className="text-sm text-gray-900">{data.skuNumber || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Last Updated</p>
          <p className="text-sm text-gray-900">{formatDate(data.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
}
