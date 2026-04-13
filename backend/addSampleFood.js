import mongoose from 'mongoose';
import foodModel from './models/foodModel.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleFoodItems = [
  {
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with parmesan cheese, croutons, and caesar dressing",
    price: 8.99,
    category: "Salad",
    image: "caesar_salad.jpg"
  },
  {
    name: "Greek Salad",
    description: "Mediterranean salad with feta cheese, olives, tomatoes, and cucumbers",
    price: 7.99,
    category: "Salad",
    image: "greek_salad.jpg"
  },
  {
    name: "Chicken Roll",
    description: "Grilled chicken with lettuce and tomato in a soft tortilla wrap",
    price: 6.99,
    category: "Rolls",
    image: "chicken_roll.jpg"
  },
  {
    name: "Veggie Roll",
    description: "Fresh vegetables with hummus in a whole wheat wrap",
    price: 5.99,
    category: "Rolls",
    image: "veggie_roll.jpg"
  },
  {
    name: "Chocolate Cake",
    description: "Decadent chocolate cake with rich frosting",
    price: 4.99,
    category: "Cake",
    image: "chocolate_cake.jpg"
  },
  {
    name: "Cheesecake",
    description: "New York style cheesecake with berry topping",
    price: 5.49,
    category: "Cake",
    image: "cheesecake.jpg"
  },
  {
    name: "Ice Cream Sundae",
    description: "Vanilla ice cream with chocolate sauce, nuts, and cherry",
    price: 3.99,
    category: "Deserts",
    image: "ice_cream_sundae.jpg"
  },
  {
    name: "Brownie",
    description: "Warm chocolate brownie with vanilla ice cream",
    price: 4.49,
    category: "Deserts",
    image: "brownie.jpg"
  },
  {
    name: "Club Sandwich",
    description: "Triple-decker sandwich with turkey, bacon, lettuce, and tomato",
    price: 8.49,
    category: "Sandwich",
    image: "club_sandwich.jpg"
  },
  {
    name: "Grilled Cheese",
    description: "Classic grilled cheese sandwich with tomato soup",
    price: 6.49,
    category: "Sandwich",
    image: "grilled_cheese.jpg"
  },
  {
    name: "Spaghetti Carbonara",
    description: "Italian pasta with bacon, eggs, and parmesan cheese",
    price: 12.99,
    category: "Pasta",
    image: "spaghetti_carbonara.jpg"
  },
  {
    name: "Penne Arrabiata",
    description: "Spicy penne pasta with garlic, tomatoes, and chili peppers",
    price: 11.99,
    category: "Pasta",
    image: "penne_arrabiata.jpg"
  },
  {
    name: "Vegetable Noodles",
    description: "Stir-fried noodles with mixed vegetables and soy sauce",
    price: 9.99,
    category: "Noodles",
    image: "vegetable_noodles.jpg"
  },
  {
    name: "Chicken Noodles",
    description: "Stir-fried noodles with chicken and vegetables",
    price: 10.99,
    category: "Noodles",
    image: "chicken_noodles.jpg"
  },
  {
    name: "Mixed Veg Platter",
    description: "Assorted fresh vegetables with dip",
    price: 7.99,
    category: "Pure Veg",
    image: "mixed_veg_platter.jpg"
  },
  {
    name: "Paneer Tikka",
    description: "Grilled cottage cheese with spices and herbs",
    price: 9.49,
    category: "Pure Veg",
    image: "paneer_tikka.jpg"
  }
];

const addSampleFood = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food_delivery');
    console.log('Connected to MongoDB');

    // Clear existing food items
    await foodModel.deleteMany({});
    console.log('Cleared existing food items');

    // Add sample food items
    const addedItems = await foodModel.insertMany(sampleFoodItems);
    console.log(`Added ${addedItems.length} sample food items`);

    // Display added items
    addedItems.forEach(item => {
      console.log(`- ${item.name} (${item.category}) - $${item.price}`);
    });

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error adding sample food:', error);
    process.exit(1);
  }
};

addSampleFood();
