import {
  Car,
  Film,
  Home,
  Lightbulb,
  MoreHorizontal,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Utensils,
} from "lucide-react";

export const expenseCategories = {
  food: <Utensils size={16} />, // Food
  groceries: <ShoppingBag size={16} />, // Groceries
  transport: <Car size={16} />, // Travel/Fuel
  rent: <Home size={16} />, // Rent
  bills: <Lightbulb size={16} />, // Electricity/Water
  mobile: <Smartphone size={16} />, // Mobile/Internet
  entertainment: <Film size={16} />, // Movies/OTT
  shopping: <ShoppingCart size={16} />, // Shopping
  others: <MoreHorizontal size={16} />, // Others
};
