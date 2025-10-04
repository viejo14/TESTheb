import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductForm from './ProductForm'
import { deleteProduct } from '../../services/api'

const ProductsManager = ({ products, categories, onRefresh, adminData }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || product.category_id?.toString() === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDeleteProduct = async (productId) => {
    try {
      // Optimistic update - remove product immediately
      adminData.removeProductOptimistic(productId)
      setDeleteConfirm(null)

      const response = await deleteProduct(productId)
      if (response.success) {
        // Success - the optimistic update was correct
        onRefresh() // Ensure data consistency
      } else {
        // Error - revert optimistic update
        onRefresh()
        alert('Error eliminando producto: ' + response.message)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      // Error - revert optimistic update
      onRefresh()
      alert('Error eliminando producto')
    }
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingProduct(null)
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white">Gestión de Productos</h2>
          <button
            className="px-6 py-3 bg-yellow-400 text-bg-primary font-bold rounded-lg hover:bg-yellow-300 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={handleAddProduct}
          >
            ➕ Agregar Producto
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Buscar productos
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Filtrar por categoría
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            className="bg-bg-primary/80 border-2 border-gray-500/30 hover:border-yellow-400/50 rounded-xl p-6 backdrop-blur-sm transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Product Image */}
            <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-700">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-4xl">📦</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-2 mb-4">
              <h3 className="text-lg font-bold text-white line-clamp-1">
                {product.name}
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2">
                {product.description || 'Sin descripción'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-yellow-400 font-bold text-lg">
                  ${parseFloat(product.price).toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">
                  {product.category_name || 'Sin categoría'}
                </span>
              </div>

              {/* Stock disponible */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-600">
                <span className="text-sm text-gray-400">
                  Stock disponible:
                </span>
                <span className={`text-sm font-bold px-2 py-1 rounded ${
                  (product.stock || 0) > 0
                    ? 'text-green-400 bg-green-400/20'
                    : 'text-red-400 bg-red-400/20'
                }`}>
                  {product.stock || 0} unidades
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={() => handleEditProduct(product)}
              >
                ✏️ Editar
              </button>
              <button
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={() => setDeleteConfirm(product)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <motion.div
          className="text-center py-16 px-8 bg-bg-primary/80 border-2 border-gray-500/30 rounded-xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-6 opacity-50">📦</div>
          <h3 className="text-xl text-white mb-4">No se encontraron productos</h3>
          <p className="text-gray-400 text-lg mb-8">
            {searchTerm || filterCategory
              ? 'No hay productos que coincidan con los filtros seleccionados'
              : 'No hay productos creados aún'
            }
          </p>
          {!searchTerm && !filterCategory && (
            <button
              className="px-8 py-4 bg-yellow-400 text-bg-primary font-bold rounded-lg hover:bg-yellow-300 transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={handleAddProduct}
            >
              ➕ Crear primer producto
            </button>
          )}
        </motion.div>
      )}

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ProductForm
            product={editingProduct}
            categories={categories}
            onClose={closeForm}
            onSuccess={handleFormSuccess}
            adminData={adminData}
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
                ¿Eliminar producto?
              </h3>
              <p className="text-gray-300 mb-6">
                ¿Estás seguro de que quieres eliminar "{deleteConfirm.name}"? Esta acción no se puede deshacer.
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
                  onClick={() => handleDeleteProduct(deleteConfirm.id)}
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

export default ProductsManager