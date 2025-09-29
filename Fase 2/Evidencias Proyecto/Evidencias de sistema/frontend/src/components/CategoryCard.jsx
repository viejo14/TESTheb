import { Link } from 'react-router-dom'

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
    <Link
      to={`/catalog?category=${id}`}
      className="group relative flex flex-col justify-center items-center text-decoration-none bg-bg-primary/80 border-2 border-slate-700/60 rounded-xl p-8 text-center transition-all duration-300 h-75 min-h-75 max-h-75 w-full overflow-hidden backdrop-blur-sm hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_8px_25px_rgba(251,191,36,0.2)] hover:bg-bg-primary/90 before:absolute before:inset-0 before:bg-gradient-to-br before:from-slate-50/5 before:to-slate-200/10 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
    >
      <div className="relative z-10 text-6xl mb-4 transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group-hover:scale-110 group-hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
        {getCategoryIcon(name)}
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-text-primary mb-3 transition-colors duration-300 leading-tight min-h-10 flex items-center justify-center group-hover:text-text-secondary">
          {name}
        </h3>
        {description && (
          <p className="text-text-muted text-base leading-relaxed mb-4">
            {description}
          </p>
        )}
        <span className="text-text-secondary font-semibold text-sm opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:text-text-primary">
          Ver productos →
        </span>
      </div>
    </Link>
  )
}

export default CategoryCard