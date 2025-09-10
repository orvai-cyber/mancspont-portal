import React, { useState, useRef, useEffect } from 'react';

/**
 * ResponsiveImage komponens intelligens képkezeléssel
 * - Egyszerű fallback üzemmód amíg a backend WebP feldolgozás nincs beállítva
 * - Lazy loading
 * - Error handling
 */

const ResponsiveImage = ({
  src,
  alt = '',
  size = 'medium', // Egyelőre csak dokumentációs célból
  aspectRatio = 'square', // square, wide, portrait, original
  className = '',
  loading = 'lazy',
  priority = false,
  onClick,
  style = {},
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  // Képarány konfigurációk
  const aspectRatioConfig = {
    square: '1/1',
    wide: '16/9', 
    portrait: '3/4',
    banner: '3/1',
    original: 'auto'
  };

  // Lazy loading intersection observer
  useEffect(() => {
    if (!imgRef.current || priority || loading !== 'lazy') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageLoaded(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority, loading]);

  // Error handling
  const handleError = () => {
    console.log('Image load error:', src);
    setImageError(true);
  };

  const handleLoad = () => {
    setImageLoaded(true);
  };

  // Loading state
  const shouldLoad = priority || loading !== 'lazy' || imageLoaded;

  // Fallback komponens hiba esetén
  if (imageError || !src) {
    return (
      <div 
        className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 ${className}`}
        style={{
          aspectRatio: aspectRatioConfig[aspectRatio],
          ...style
        }}
        {...props}
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  return (
    <div 
      ref={imgRef}
      className={`overflow-hidden ${className}`}
      onClick={onClick}
      style={{
        aspectRatio: aspectRatioConfig[aspectRatio],
        ...style
      }}
      {...props}
    >
      {shouldLoad ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={handleError}
          onLoad={handleLoad}
          loading={loading}
          style={{
            opacity: imageLoaded ? 1 : 0.7
          }}
        />
      ) : (
        // Placeholder amíg lazy load-ol
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center text-gray-400">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;