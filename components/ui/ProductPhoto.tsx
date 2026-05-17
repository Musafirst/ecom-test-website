import Image from 'next/image'

interface ProductPhotoProps {
  src: string
  alt: string
  className?: string
  imageClassName?: string
  aspectRatio?: string
  sizes?: string
  quality?: number
  priority?: boolean
}

export function ProductPhoto({
  src,
  alt,
  className = '',
  imageClassName = 'object-cover',
  aspectRatio = '4/5',
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw',
  quality = 84,
  priority = false,
}: ProductPhotoProps) {
  return (
    <div
      className={`relative isolate w-full overflow-hidden bg-[#EDE8DC] ${className}`}
      style={{ aspectRatio }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.94),rgba(237,232,220,0.82)_34%,rgba(196,151,58,0.34)_78%,rgba(33,24,15,0.22)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.56),transparent_34%),linear-gradient(0deg,rgba(12,11,9,0.22),transparent_42%)]" />
      <div className="absolute left-1/2 top-[73%] h-[18%] w-[58%] -translate-x-1/2 rounded-full bg-black/18 blur-2xl" />
      <div className="absolute inset-x-[12%] bottom-[9%] h-px bg-gradient-to-r from-transparent via-jamm-gold/45 to-transparent" />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        className={`relative z-10 ${imageClassName}`}
        loading={priority ? undefined : 'lazy'}
      />
    </div>
  )
}
