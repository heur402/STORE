import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart is Empty 🛍️</h2>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      {cartItems.map((item) => (
        <div className="cart-item" key={item.id}>
          <img src={item.image} alt={item.name} />

          <div className="cart-details">
            <h4>{item.name}</h4>
            <p>${item.price}</p>

            <input
              type="number"
              value={item.quantity}
              min="1"
              onChange={(e) =>
                updateQuantity(item.id, parseInt(e.target.value))
              }
            />
          </div>

          <button onClick={() => removeFromCart(item.id)}>
            Remove
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <h3>Total: ${totalPrice.toFixed(2)}</h3>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;