'use client';

import Image from 'next/image';

export function LogoMarquee({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  const duplicated = [...images, ...images];

  return (
    <div className="w-full max-w-full overflow-hidden bg-white py-8" style={{ contain: 'layout' }}>
      <div className="relative flex min-h-[4rem] items-center justify-center">
        <div className="flex animate-marquee items-center gap-16 pr-16">
          {duplicated.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative flex h-10 shrink-0 items-center justify-center sm:h-12 md:h-14 lg:h-16"
              style={{ minWidth: 'min(120px, 28vw)' }}
            >
              <Image
                src={src}
                alt="Partner logo"
                width={160}
                height={64}
                className="max-h-full w-auto object-contain object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
