import { createContext, useEffect, useState } from "react";
import { food_list, menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/_/backend" : "http://localhost:5002")
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
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data)
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