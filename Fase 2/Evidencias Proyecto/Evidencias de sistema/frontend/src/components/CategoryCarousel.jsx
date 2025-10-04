import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { getCategoryImage, CATEGORY_IMAGES } from '../data/categoryImages'

const CategoryCarousel = ({ categories = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const carouselRef = useRef(null)
  const autoPlayRef = useRef(null)

  // Enhanced categories with images and fallback data
  const enhancedCategories = categories.length > 0 ?
    categories.map(category => ({
      ...category,
      image: getCategoryImage(category),
      description: category.description || `Bordados especializados para ${category.name}`
    })) :
    [
      {
        id: 1,
        name: 'Mascotas',
        description: 'Bordados únicos para identificar y personalizar accesorios de mascotas',
        image: CATEGORY_IMAGES.mascotas
      },
      {
        id: 2,
        name: 'Colegios',
        description: 'Uniformes y artículos escolares con bordados institucionales',
        image: CATEGORY_IMAGES.colegios
      },
      {
        id: 3,
        name: 'Personalizados',
        description: 'Diseños únicos y personalizados para cualquier ocasión',
        image: CATEGORY_IMAGES.personalizado
      },
      {
        id: 4,
        name: 'Empresas',
        description: 'Bordados corporativos para uniformes y merchandising',
        image: CATEGORY_IMAGES.empresas
      }
    ]

  const totalSlides = enhancedCategories.length
  const slidesToShow = Math.min(3, totalSlides) // Show max 3 slides at once

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && totalSlides > slidesToShow) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % (totalSlides - slidesToShow + 1))
      }, 4000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, totalSlides, slidesToShow])

  const goToSlide = (index) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ?
      (totalSlides - slidesToShow) :
      currentIndex - 1
    goToSlide(newIndex)
  }

  const goToNext = () => {
    const newIndex = currentIndex >= (totalSlides - slidesToShow) ?
      0 :
      currentIndex + 1
    goToSlide(newIndex)
  }

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  if (totalSlides === 0) {
    return (
      <div className="relative w-full my-16 overflow-hidden animate-slide-in">
        <div className="flex justify-center items-center h-75 bg-gray-50 rounded-2xl text-gray-500 text-lg">
          <p>No hay categorías disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative w-full my-16 overflow-hidden animate-slide-in"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
  <div className="relative w-full h-80 md:h-64 md:h-[520px] lg:h-[640px] xl:h-[720px] overflow-hidden rounded-3xl shadow-2xl">
        {/* Navigation Buttons */}
        {totalSlides > slidesToShow && (
          <>
            <button
              className="absolute top-1/2 left-5 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm border-0 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:bg-white hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              onClick={goToPrevious}
              aria-label="Categoría anterior"
            >
              <HiChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              className="absolute top-1/2 right-5 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm border-0 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:bg-white hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              onClick={goToNext}
              aria-label="Siguiente categoría"
            >
              <HiChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </>
        )}

        {/* Carousel Track */}
        <div
          className="flex h-full transition-transform duration-600 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          ref={carouselRef}
          style={{
            transform: `translateX(-${currentIndex * (100 / totalSlides)}%)`,
            width: `${(totalSlides / slidesToShow) * 100}%`
          }}
        >
          {enhancedCategories.map((category) => (
            <div
              key={category.id}
              className="flex-shrink-0 h-full px-2.5 box-border"
              style={{ width: `${100 / totalSlides}%` }}
            >
              <Link
                to={`/catalog?category=${category.id}`}
                className="group block w-full h-full relative text-decoration-none rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:-translate-y-2 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-4"
              >
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/10 to-black/60 flex items-end p-10 transition-all duration-300 group-hover:from-black/50 group-hover:via-black/20 group-hover:to-black/70">
                    <div className="text-white text-left transform translate-y-2.5 transition-transform duration-300 group-hover:translate-y-0">
                      <h3 className="text-3xl font-bold mb-2 text-white text-shadow-lg">
                        {category.name}
                      </h3>
                      <p className="text-base leading-5 mb-4 text-white/90 opacity-0 transform translate-y-5 transition-all duration-300 delay-100 group-hover:opacity-100 group-hover:translate-y-0">
                        {category.description}
                      </p>
                      <span className="inline-block px-6 py-3 bg-white/20 border-2 border-white/30 rounded-full text-white font-semibold text-sm uppercase tracking-wide transition-all duration-300 backdrop-blur-sm opacity-0 transform translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-white/30 group-hover:border-white/50">
                        Ver productos
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {totalSlides > slidesToShow && (
        <div className="flex justify-center items-center gap-3 mt-6 p-2">
          {Array.from({ length: totalSlides - slidesToShow + 1 }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full border-0 cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                currentIndex === index
                  ? 'bg-yellow-700 scale-125 '
                  : 'bg-yellow-400 hover:bg-yellow-100 hover:scale-110'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a la página ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryCarousel