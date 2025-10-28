import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CategoryForm from './CategoryForm'
import { deleteCategory } from '../../services/api'
import { getCategoryImage } from '../../data/categoryImages'

const CategoriesManager = ({ categories, onRefresh }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleAddCategory = () => {
    setEditingCategory(null)
    setShowForm(true)
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleDeleteCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await deleteCategory(categoryId, token)
      if (response.success) {
        onRefresh()
        setDeleteConfirm(null)
      } else {
        alert('Error eliminando categoría: ' + response.message)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error eliminando categoría')
    }
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingCategory(null)
  }

  const handleFormSuccess = () => {
    closeForm()
    onRefresh()
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <motion.div
        className="bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl p-6 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Gestión de Categorías</h2>
            <p className="text-gray-400">
              Administra las categorías de productos. Total: {categories.length} categorías
            </p>
          </div>
          <button
            className="px-6 py-3 bg-yellow-400 text-bg-primary font-bold rounded-lg hover:bg-yellow-300 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={handleAddCategory}
          >
            ➕ Agregar Categoría
          </button>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className="bg-bg-primary/80 border-2 border-gray-500/30 hover:border-yellow-400/50 rounded-lg p-4 backdrop-blur-sm min-h-[280px] flex flex-col transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category Image */}
            <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
              {(() => {
                const imageUrl = getCategoryImage(category)
                if (imageUrl && imageUrl !== '/images/categories/default.jpg') {
                  return (
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-contain bg-zinc-900/88"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  )
                }
                return (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-3xl">📂</span>
                  </div>
                )
              })()}
              {/* Fallback */}
              <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                <span className="text-3xl">📂</span>
              </div>
            </div>

            {/* Category Info */}
            <div className="flex-grow flex flex-col justify-between">
              <div className="space-y-2 mb-3">
                <h3 className="text-base font-bold text-white">
                  {category.name}
                </h3>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      ID: {category.id}
                    </span>
                  </div>
                  <div className="text-yellow-400 font-medium text-xs">
                    {new Date(category.updated_at || category.created_at).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
              <button
                className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium hover:scale-105 active:scale-95"
                onClick={() => handleEditCategory(category)}
              >
                ✏️ Editar
              </button>
              <button
                className="flex-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium hover:scale-105 active:scale-95"
                onClick={() => setDeleteConfirm(category)}
              >
                🗑️ Eliminar
              </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {categories.length === 0 && (
        <motion.div
          className="text-center py-16 px-8 bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-6 opacity-50">📂</div>
          <h3 className="text-xl text-white mb-4">No hay categorías creadas</h3>
          <p className="text-gray-400 text-lg mb-8">
            Crea tu primera categoría para organizar tus productos
          </p>
          <button
            className="px-8 py-4 bg-yellow-400 text-bg-primary font-bold rounded-lg hover:bg-yellow-300 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={handleAddCategory}
          >
            ➕ Crear primera categoría
          </button>
        </motion.div>
      )}

      {/* Category Form Modal */}
      <AnimatePresence>
        {showForm && (
          <CategoryForm
            category={editingCategory}
            onClose={closeForm}
            onSuccess={handleFormSuccess}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              className="bg-zinc-900 border-2 border-gray-500 rounded-xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                ¿Eliminar categoría?
              </h3>
              <p className="text-gray-300 mb-6">
                ¿Estás seguro de que quieres eliminar la categoría "{deleteConfirm.name}"?
                Los productos en esta categoría quedarán sin categoría asignada.
              </p>
              <div className="flex gap-4">
                <button
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancelar
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                  onClick={() => handleDeleteCategory(deleteConfirm.id)}
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CategoriesManager