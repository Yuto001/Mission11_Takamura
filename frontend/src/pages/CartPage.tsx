import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div>
      <h2>Your cart</h2>
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <ul className="list-group">
            {cart.map((item: CartItem) => (
              <li
                key={item.bookID}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  Quantity: {item.quantity} | Price per book: $
                  {item.price.toFixed(2)} | Subtotal: $
                  {(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromCart(item.bookID)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/*I added this grid for extra grid so that this page looks better. */}
      <h3>Total: ${total.toFixed(2)}</h3>
      <button>Checkout</button>
      <button onClick={() => navigate('/projects')}>Continue Browsing</button>
    </div>
  );
}

export default CartPage;
