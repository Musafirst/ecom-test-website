interface ProductPhotoProps {
  src: string
  alt: string
  className?: string
  aspectRatio?: string
}

export function ProductPhoto({
  src,
  alt,
  className = '',
  aspectRatio = '4/5',
}: ProductPhotoProps) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-[#EDE8DC] ${className}`}
      style={{ aspectRatio }}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
