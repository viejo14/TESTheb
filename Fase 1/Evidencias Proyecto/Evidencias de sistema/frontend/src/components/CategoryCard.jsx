import { Link } from 'react-router-dom'
import './CategoryCard.css'

const CategoryCard = ({ category }) => {
  const { id, name, description } = category

  // Map category names to icons (you can replace with actual images later)
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Colegios': '🎓',
      'Empresas/Pymes': '🏢',
      'Mascotas': '🐾',
      'Diseño Personalizado': '🎨'
    }
    return iconMap[categoryName] || '📦'
  }

  return (
    <Link to={`/catalog?category=${id}`} className="category-card">
      <div className="category-card__icon">
        {getCategoryIcon(name)}
      </div>
      <div className="category-card__content">
        <h3 className="category-card__title">{name}</h3>
        {description && (
          <p className="category-card__description">{description}</p>
        )}
        <span className="category-card__link">Ver productos →</span>
      </div>
    </Link>
  )
}

export default CategoryCard