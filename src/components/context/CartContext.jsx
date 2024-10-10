import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(undefined);

export const CartContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartLength, setCartLength] = useState([]);

  useEffect(() => {
    if (user) {
      setCart(user.cart || []);
      setCartLength(user?.cart?.length || 0);
    }
  }, [user]);

  const updatedCart = (cart) => setCart(cart);

  return (
    <CartContext.Provider
      value={{ cart, updatedCart, cartLength, setCartLength }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
