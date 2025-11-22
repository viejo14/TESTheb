import React, { useEffect, useState } from 'react'

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Iniciar fade out
  const handleFinish = () => {
    setFadeOut(true)
    setTimeout(() => {
      if (onFinish) onFinish()
    }, 800)
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
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-800 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <img
        src="/giftestheb2.gif"
        alt="TESTheb Loading"
        className={`max-w-[85vw] max-h-[85vh] object-contain transition-all duration-800 ${
          imageLoaded && !fadeOut ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
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
