import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/components/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/components/card';
import { useImageUrl } from '@/services/images/use-image-url';

type ProductCardProps = {
  id: string;
  productName: string;
  manufacturer: string;
  marketPrice: number[];
  totalWeight: string;
  totalWeightUnit: string;
  categoryName: string[];
  verificationStatus: string;
  confidenceScore: string;
  imageId?: string;
};

export function ProductCard({
  id,
  productName,
  manufacturer,
  marketPrice,
  totalWeight,
  totalWeightUnit,
  categoryName,
  verificationStatus,
  confidenceScore,
  imageId,
}: ProductCardProps) {
  const imageUrl = useImageUrl(imageId);

  const formatPrice = (prices: number[]) => {
    if (!prices || prices.length === 0) {
      return 'N/A';
    }

    // Filter out zero values and format with 2 decimal places
    const validPrices = prices.filter(p => p > 0);

    if (!validPrices || validPrices.length === 0 || validPrices[0] === undefined) {
      return 'N/A';
    }

    if (validPrices.length === 1) {
      return `$${validPrices[0].toFixed(2)}`;
    }

    // Show range for multiple prices
    const min = Math.min(...validPrices);
    const max = Math.max(...validPrices);

    if (min === max) {
      return `$${min.toFixed(2)}`;
    }

    return `$${min.toFixed(2)} - $${max.toFixed(2)}`;
  };

  const getVerificationColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unverified':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="flex h-full flex-col justify-between gap-3 transition-shadow duration-200 hover:shadow-lg sm:gap-4">
      <div>
        {/* Product Image */}
        <div className="relative h-40 w-full sm:h-48">
          <Image
            src={imageUrl || '/assets/images/no-image.webp'}
            alt={productName}
            fill
            className="rounded-t-lg object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        </div>

        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <Link href={`/apps/history/${id}`} className="line-clamp-2 text-base font-semibold text-gray-900 transition-colors hover:text-blue-600 sm:text-lg">
                {productName}
              </Link>
              <p className="mt-1 line-clamp-1 text-xs text-gray-600 sm:text-sm">{manufacturer}</p>
            </div>
            <Badge
              variant="secondary"
              className={`self-start sm:ml-2 ${getVerificationColor(verificationStatus)}`}
            >
              {verificationStatus}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 sm:space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-700 sm:text-sm">Market Price</p>
              <p className="truncate text-base font-semibold text-green-600 sm:text-lg">
                {formatPrice(marketPrice)}
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-700 sm:text-sm">Weight</p>
              <p className="truncate text-xs text-gray-900 sm:text-sm">
                {totalWeight}
                {' '}
                {totalWeightUnit}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">Categories</p>
            <div className="flex flex-wrap gap-1">
              {categoryName.map(category => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="bg-blue-50 text-xs text-blue-700 hover:bg-blue-100"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

        </CardContent>
      </div>
      <div>
        <div className="flex items-center justify-between gap-2 border-t pt-2">
          <div className="text-xs whitespace-nowrap text-gray-500">
            Confidence:
            {' '}
            {(Number.parseFloat(confidenceScore) * 100).toFixed(0)}
            %
          </div>
          <div className="h-2 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 sm:w-16">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"
              style={{ width: `${Number.parseFloat(confidenceScore) * 100}%` }}
            />
          </div>
        </div>
      </div>

    </Card>
  );
}
