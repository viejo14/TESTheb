/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('testheb_cart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('testheb_cart', JSON.stringify(cartItems))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [cartItems])

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setIsLoading(true)

    try {
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id)

        let newItems
        if (existingItem) {
          // Update quantity if item already exists
          newItems = prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: Math.min((parseInt(item.quantity) || 0) + (parseInt(quantity) || 1), product.stock) }
              : item
          )
        } else {
          // Add new item
          const newProduct = {
            ...product,
            quantity: parseInt(quantity) || 1,
            addedAt: new Date().toISOString()
          }
          //console.log('Adding new product:', newProduct)
          newItems = [...prevItems, newProduct]
        }

        //console.log('CartContext - New items:', newItems)
        return newItems
      })

      return { success: true, message: 'Producto agregado al carrito' }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, message: 'Error al agregar producto' }
    } finally {
      setIsLoading(false)
    }
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    const parsedQuantity = parseInt(newQuantity) || 0

    if (parsedQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === productId) {
          const maxQuantity = parseInt(item.stock) || 999
          return { ...item, quantity: Math.min(parsedQuantity, maxQuantity) }
        }
        return item
      })
    )
  }

  // Clear entire cart
  const clearCart = () => {
    setCartItems([])
  }

  // Get cart totals
  const getCartTotals = () => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    return {
      totalItems,
      totalPrice,
      itemCount: cartItems.length
    }
  }

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId)
  }

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const value = {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotals,
    isInCart,
    getItemQuantity
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}