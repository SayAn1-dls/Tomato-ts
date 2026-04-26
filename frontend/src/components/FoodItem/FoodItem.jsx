import React, { useContext, useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';
import FoodItemModal from '../FoodItemModal/FoodItemModal';
import getImageUrl from '../../utils/imageUrl';

const FoodItem = ({ image, name, price, desc , id, category }) => {

    const [itemCount, setItemCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const context = useContext(StoreContext);
    const cartItems = context?.cartItems || {};
    const addToCart = context?.addToCart || (() => {});
    const removeFromCart = context?.removeFromCart || (() => {});
    const url = context?.url || "";
    const currency = context?.currency || "¥";

    // Debug logging
    console.log('FoodItem - cartItems:', cartItems);
    console.log('FoodItem - addToCart function:', typeof addToCart);

    const handleItemClick = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const foodItemData = {
        _id: id,
        name: name,
        price: price,
        description: desc,
        image: image,
        category: category || 'Food'
    };

    return (
        <>
            <div className='food-item' onClick={handleItemClick} style={{ cursor: 'pointer' }}>
                <div className='food-item-img-container'>
                    <img className='food-item-image' src={getImageUrl(url, image)} alt="" />
                    {!cartItems[id] || cartItems[id] === 0
                    ?<img className='add' onClick={(e) => { e.stopPropagation(); addToCart(id); }} src={assets.add_icon_white} alt="" />
                    :<div className="food-item-counter">
                            <img src={assets.remove_icon_red} onClick={(e) => { e.stopPropagation(); removeFromCart(id); }} alt="" />
                            <p>{cartItems[id] || 0}</p>
                            <img src={assets.add_icon_green} onClick={(e) => { e.stopPropagation(); addToCart(id); }} alt="" />
                        </div>
                    }
                </div>
                <div className="food-item-info">
                    <div className="food-item-name-rating">
                        <p>{name}</p> <img src={assets.rating_starts} alt="" />
                    </div>
                    <p className="food-item-desc">{desc}</p>
                    <p className="food-item-price">{currency}{price}</p>
                </div>
            </div>
            {showModal && (
                <FoodItemModal 
                    item={foodItemData} 
                    onClose={closeModal} 
                />
            )}
        </>
    )
}

export default FoodItem
