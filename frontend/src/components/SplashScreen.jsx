import React, { useEffect, useState } from 'react'

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Iniciar fade out
  const handleFinish = () => {
    setFadeOut(true)
    setTimeout(() => {
      if (onFinish) onFinish()
    }, 300)
  }

  useEffect(() => {
    // Cerrar automáticamente después de 4 segundos (duración estimada del GIF)
    const autoCloseTimer = setTimeout(() => {
      handleFinish()
    }, 2000)

    return () => clearTimeout(autoCloseTimer)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <img
        src="/giftestheb2.gif"
        alt="TESTheb Loading"
        className="max-w-[90vw] max-h-[90vh] object-contain"
        style={{
          opacity: imageLoaded && !fadeOut ? 1 : 0,
          transform: imageLoaded && !fadeOut ? 'scale(1)' : 'scale(0.98)',
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
          imageRendering: '-webkit-optimize-contrast', // Mejora la nitidez en Chrome/Safari
          WebkitFontSmoothing: 'antialiased',
          backfaceVisibility: 'hidden',
          willChange: 'opacity, transform'
        }}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          console.warn('Error cargando GIF splash, cerrando...')
          handleFinish()
        }}
      />
    </div>
  )
}

export default SplashScreen
