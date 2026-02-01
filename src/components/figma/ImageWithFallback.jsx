import { useState } from 'react'

const ImageWithFallback = ({ src, alt, fallback, className, ...props }) => {
  const [error, setError] = useState(false)

  return (
      <img
          src={error ? fallback : src}
          alt={alt}
          className={className}
          onError={() => setError(true)}
          {...props}
      />
  )
}

export default ImageWithFallback
