import clsx from 'clsx';
import { ImgHTMLAttributes, useState } from 'react';

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  wrapperClassName?: string;
}

const DEFAULT_FALLBACK = '/images/image-placeholder.svg';

export default function ImageWithFallback({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  wrapperClassName,
  className,
  onError,
  ...props
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <div className={clsx(wrapperClassName)}>
      <img
        {...props}
        src={currentSrc}
        className={clsx('block w-full h-full object-cover', className)}
        onError={(event) => {
          if (currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
          } else {
            onError?.(event);
          }
        }}
      />
    </div>
  );
}

