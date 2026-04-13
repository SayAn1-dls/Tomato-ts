import { createContext, useEffect, useState } from "react";
import { food_list, menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://tomato-backend.vercel.app/api" : "http://localhost:5002")
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredFoodList, setFilteredFoodList] = useState([])
    const currency = "₹";
    const deliveryCharge = 50;

    const addToCart = async (itemId) => {
        let newCartItems;
        if (!cartItems[itemId]) {
            newCartItems = { ...cartItems, [itemId]: 1 };
            setCartItems(newCartItems);
        }
        else {
            newCartItems = { ...cartItems, [itemId]: cartItems[itemId] + 1 };
            setCartItems(newCartItems);
        }
        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        let newCartItems = { ...cartItems, [itemId]: cartItems[itemId] - 1 };
        setCartItems(newCartItems);
        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
              if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }  
            } catch (error) {
                
            }
            
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        if (import.meta.env.PROD) {
            // Use mock data for Vercel deployment
            const mockFoodData = [
                {"_id":"69dcb166928461d0193c2e65","name":"Caesar Salad","description":"Fresh romaine lettuce with parmesan cheese, croutons, and caesar dressing","price":8.99,"image":"caesar_salad.jpg","category":"Salad","__v":0},
                {"_id":"69dcb166928461d0193c2e66","name":"Greek Salad","description":"Mediterranean salad with feta cheese, olives, tomatoes, and cucumbers","price":7.99,"image":"greek_salad.jpg","category":"Salad","__v":0},
                {"_id":"69dcb166928461d0193c2e67","name":"Chicken Roll","description":"Grilled chicken with lettuce and tomato in a soft tortilla wrap","price":6.99,"image":"chicken_roll.jpg","category":"Rolls","__v":0},
                {"_id":"69dcb166928461d0193c2e68","name":"Veggie Roll","description":"Fresh vegetables with hummus in a whole wheat wrap","price":5.99,"image":"veggie_roll.jpg","category":"Rolls","__v":0},
                {"_id":"69dcb166928461d0193c2e69","name":"Chocolate Cake","description":"Decadent chocolate cake with rich frosting","price":4.99,"image":"chocolate_cake.jpg","category":"Cake","__v":0},
                {"_id":"69dcb166928461d0193c2e6b","name":"Cheesecake","description":"New York style cheesecake with berry topping","price":5.49,"image":"cheesecake.jpg","category":"Cake","__v":0},
                {"_id":"69dcb166928461d0193c2e6c","name":"Ice Cream Sundae","description":"Vanilla ice cream with chocolate sauce, nuts, and cherry","price":3.99,"image":"ice_cream_sundae.jpg","category":"Deserts","__v":0},
                {"_id":"69dcb166928461d0193c2e6d","name":"Club Sandwich","description":"Triple-decker sandwich with turkey, bacon, lettuce, and tomato","price":8.49,"image":"club_sandwich.jpg","category":"Sandwich","__v":0},
                {"_id":"69dcb166928461d0193c2e6e","name":"Grilled Cheese","description":"Classic grilled cheese sandwich with tomato soup","price":6.49,"image":"grilled_cheese.jpg","category":"Sandwich","__v":0},
                {"_id":"69dcb166928461d0193c2e6f","name":"Spaghetti Carbonara","description":"Italian pasta with bacon, eggs, and parmesan cheese","price":12.99,"image":"spaghetti_carbonara.jpg","category":"Pasta","__v":0},
                {"_id":"69dcb166928461d0193c2e70","name":"Penne Arrabiata","description":"Spicy penne pasta with garlic, tomatoes, and chili peppers","price":11.99,"image":"penne_arrabiata.jpg","category":"Pasta","__v":0},
                {"_id":"69dcb166928461d0193c2e71","name":"Vegetable Noodles","description":"Stir-fried noodles with mixed vegetables and soy sauce","price":9.99,"image":"vegetable_noodles.jpg","category":"Noodles","__v":0},
                {"_id":"69dcb166928461d0193c2e72","name":"Chicken Noodles","description":"Stir-fried noodles with chicken and vegetables","price":10.99,"image":"chicken_noodles.jpg","category":"Noodles","__v":0},
                {"_id":"69dcb166928461d0193c2e73","name":"Mixed Veg Platter","description":"Assorted fresh vegetables with dip","price":7.99,"image":"mixed_veg_platter.jpg","category":"Pure Veg","__v":0},
                {"_id":"69dcb166928461d0193c2e74","name":"Paneer Tikka","description":"Grilled cottage cheese with spices and herbs","price":9.49,"image":"paneer_tikka.jpg","category":"Pure Veg","__v":0}
            ];
            setFoodList(mockFoodData);
        } else {
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data)
        }
    }

    const loadCartData = async (token) => {
        const response = await axios.get(url + "/api/cart/get", {}, { headers: token });
        setCartItems(response.data.cartData);
    }

    // Search functionality
    const filterFoodItems = (query) => {
        if (!query || query.trim() === "") {
            setFilteredFoodList(food_list)
            return
        }

        const filtered = food_list.filter(item => {
            const searchTerm = query.toLowerCase().trim()
            return (
                item.name.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm)
            )
        })
        setFilteredFoodList(filtered)
    }

    useEffect(() => {
        filterFoodItems(searchQuery)
    }, [searchQuery, food_list])

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            
            // Load cart from localStorage first
            const savedCart = localStorage.getItem('cartItems');
            console.log('StoreContext - Loading cart from localStorage:', savedCart);
            if (savedCart) {
                try {
                    const parsedCart = JSON.parse(savedCart);
                    console.log('StoreContext - Parsed cart:', parsedCart);
                    setCartItems(parsedCart);
                } catch (error) {
                    console.error('Error parsing cart from localStorage:', error);
                }
            } else {
                console.log('StoreContext - No cart found in localStorage');
            }
            
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData({ token: localStorage.getItem("token") })
            }
        }
        loadData()
    }, [])

    const contextValue = {
        url,
        food_list,
        filteredFoodList,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        searchQuery,
        setSearchQuery,
        filterFoodItems,
        currency,
        deliveryCharge
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;