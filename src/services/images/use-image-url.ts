import * as React from 'react';
import { useGetImageMetadata } from './metadate';

export const buildCdnUrl = (imageKey?: string | null) => {
  if (!imageKey) {
    return null;
  }
  return `https://images.productlens.ai/${imageKey}`;
};

export function useImageUrl(imageId?: string) {
  const enabled = Boolean(imageId);
  const { data: url } = useGetImageMetadata(imageId as string);

  React.useEffect(() => {
    if (!enabled || !url) {
      return;
    }
    // Preload to populate the browser HTTP cache
    const img = new Image();
    img.src = url;
    return () => {
      // no cleanup required for Image preloads
    };
  }, [enabled, url]);

  return url;
}
