import { useState, useEffect, useCallback } from 'react'
import { fetchProducts, fetchCategories } from '../services/api'

export const useAdminData = (autoRefreshInterval = null) => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(Date.now())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load initial data
  const loadData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      setError(null)

      const [productsResponse, categoriesResponse] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ])

      if (productsResponse.success) {
        setProducts(productsResponse.data)
      }
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data)
      }

      setLastRefresh(Date.now())
    } catch (err) {
      console.error('Error loading admin data:', err)
      setError('Error cargando datos')
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [])

  // Manual refresh function
  const refreshData = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true)
    await loadData(!silent)
    if (!silent) setIsRefreshing(false)
  }, [loadData])

  // Optimistic update for products
  const updateProductOptimistic = useCallback((productId, updates) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, ...updates }
        : product
    ))
  }, [])

  // Optimistic add product
  const addProductOptimistic = useCallback((newProduct) => {
    setProducts(prev => [...prev, newProduct])
  }, [])

  // Optimistic remove product
  const removeProductOptimistic = useCallback((productId) => {
    setProducts(prev => prev.filter(product => product.id !== productId))
  }, [])

  // Optimistic update for categories
  const updateCategoryOptimistic = useCallback((categoryId, updates) => {
    setCategories(prev => prev.map(category =>
      category.id === categoryId
        ? { ...category, ...updates }
        : category
    ))
  }, [])

  // Optimistic add category
  const addCategoryOptimistic = useCallback((newCategory) => {
    setCategories(prev => [...prev, newCategory])
  }, [])

  // Optimistic remove category
  const removeCategoryOptimistic = useCallback((categoryId) => {
    setCategories(prev => prev.filter(category => category.id !== categoryId))
  }, [])

  // Initial load
  useEffect(() => {
    loadData()
  }, [loadData])

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefreshInterval) return

    const interval = setInterval(() => {
      refreshData(true) // Silent refresh
    }, autoRefreshInterval)

    return () => clearInterval(interval)
  }, [autoRefreshInterval, refreshData])

  return {
    // Data
    products,
    categories,
    loading,
    error,
    lastRefresh,
    isRefreshing,

    // Actions
    refreshData,
    loadData,

    // Optimistic updates
    updateProductOptimistic,
    addProductOptimistic,
    removeProductOptimistic,
    updateCategoryOptimistic,
    addCategoryOptimistic,
    removeCategoryOptimistic,

    // Utilities
    getProductById: useCallback((id) => products.find(p => p.id === parseInt(id)), [products]),
    getCategoryById: useCallback((id) => categories.find(c => c.id === parseInt(id)), [categories]),
    getProductsByCategory: useCallback((categoryId) =>
      products.filter(p => p.category_id === parseInt(categoryId)), [products]
    )
  }
}