import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/utils';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
  showLogo?: boolean;
};

const sizeConfig = {
  sm: {
    icon: 'h-8 w-8',
    imageSize: 32,
    title: 'text-sm font-bold',
    subtitle: 'text-xs',
  },
  md: {
    icon: 'h-12 w-12',
    imageSize: 48,
    title: 'text-lg font-bold',
    subtitle: 'text-sm',
  },
  lg: {
    icon: 'h-16 w-16',
    imageSize: 64,
    title: 'text-2xl font-bold',
    subtitle: 'text-base',
  },
};

export const Logo = ({
  size = 'md',
  className,
  showText = false,
  href = '/',
}: LogoProps) => {
  const config = sizeConfig[size] || sizeConfig.md;

  const logoContent = (
    <Link href={href} className={cn('flex w-full items-center gap-3', className)}>
      <div className="flex w-full items-center justify-start gap-2">
        <Image
          src="/logo/main.jpg"
          alt="Product Lens Logo"
          width={config.imageSize}
          height={config.imageSize}
          className="h-auto max-w-8 object-contain"
          // style={{
          //   filter: 'hue-rotate(120deg) saturate(1.5) brightness(0.9)',
          // }}
        />
        {showText && (
          <div className="flex items-center gap-0.5 whitespace-nowrap leading-tight text-gray-900">
            {'ProductLens'.split('').map((letter, i) => (
              <span
                key={`${letter}-${i}`}
                className="bg-gradient-to-r from-blue-900 to-teal-700 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl"
              >
                {letter}
              </span>
            ))}
          </div>
        )}

      </div>
    </Link>
  );

  // if (href) {
  //   return (
  //     <Link href={href} className="w-full max-w-24 transition-opacity hover:opacity-80">
  //       {logoContent}
  //     </Link>
  //   );
  // }

  return logoContent;
};
