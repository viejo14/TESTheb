import React, { useRef, useEffect, useState } from 'react'

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false)
  const videoRef = useRef(null)

  // Al terminar el video, iniciar fade out
  const handleVideoEnd = () => {
    setFadeOut(true)
    setTimeout(() => {
      if (onFinish) onFinish()
    }, 500) // 0.5s para el fade
  }

  // Fade-in al montar
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.style.opacity = 0
      videoRef.current.style.animation = 'fadeinSplash 1.2s forwards'
    }
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <video
        ref={videoRef}
        src="/video3.mp4"
        autoPlay
        muted
        playsInline
        className={`max-w-[80vw] max-h-[80vh] object-contain transition-opacity duration-200 filter-none ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        style={{ filter: 'none', animation: !fadeOut ? 'fadeinSplash 0.2s forwards' : undefined }}
        onEnded={handleVideoEnd}
      />
      <style>{`
        @keyframes fadeinSplash {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default SplashScreen
