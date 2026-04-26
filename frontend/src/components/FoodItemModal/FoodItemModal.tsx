import React, { useContext, useState } from 'react'
import './FoodItemModal.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'
import getImageUrl from '../../utils/imageUrl'
import formatPrice from '../../utils/formatPrice'

interface FoodItemModalProps {
  item: {
    _id: string
    name: string
    price: number
    description: string
    image: string
    category: string
  }
  onClose: () => void
}

const FoodItemModal: React.FC<FoodItemModalProps> = ({ item, onClose }) => {
  const [quantity, setQuantity] = useState(1)
  const context = useContext(StoreContext)
  const navigate = useNavigate()

  // Type guards to ensure context is not null
  if (!context) {
    throw new Error('StoreContext must be used within StoreContextProvider')
  }

  const { addToCart, cartItems, url, currency } = context

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1))
  }

  const handleAddToCart = async () => {
    await addToCart(item._id, quantity)
    onClose()
  }

  const handleOrderNow = async () => {
    await addToCart(item._id, quantity)
    onClose()
    navigate('/cart')
  }

  return (
    <div className="food-item-modal-overlay" onClick={onClose}>
      <div className="food-item-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="modal-image">
            <img src={getImageUrl(url, item.image)} alt={item.name} />
          </div>
          
          <div className="modal-details">
            <div className="modal-title">
              <h2>{item.name}</h2>
              <div className="modal-rating">
                <img src={assets.rating_starts} alt="Rating" />
              </div>
            </div>
            
            <p className="modal-description">{item.description}</p>
            <p className="modal-category">Category: {item.category}</p>
            
            <div className="modal-price">
              <span className="price-label">Price:</span>
              <span className="price-value">{formatPrice(item.price, currency)}</span>
            </div>
            
            <div className="modal-quantity">
              <span className="quantity-label">Quantity:</span>
              <div className="quantity-selector">
                <button 
                  className="quantity-btn decrease" 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button className="quantity-btn increase" onClick={increaseQuantity}>
                  +
                </button>
              </div>
            </div>
            
            <div className="modal-total">
              <span className="total-label">Total:</span>
              <span className="total-value">{formatPrice(item.price * quantity, currency)}</span>
            </div>
            
            <div className="modal-actions">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="order-now-btn" onClick={handleOrderNow}>
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodItemModal
