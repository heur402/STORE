import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const existing = cartItems.find((item) => item._id === product._id);
    const stockLimit = product.stock || 0;

    if (existing) {
      if (existing.quantity >= stockLimit) {
        alert("Cannot exceed available stock");
        return;
      }
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      if (stockLimit <= 0) {
        alert("This product is out of stock");
        return;
      }
      setCartItems([...cartItems, { ...product, quantity: product.quantity || 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, qty) => {
    setCartItems(
      cartItems.map((item) => {
        if (item._id === id) {
          const stockLimit = item.stock || 0;
          let newQty = qty;
          if (qty > stockLimit) {
            newQty = stockLimit;
            alert("Maximum available stock reached");
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};