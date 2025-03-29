import { useNavigate, useParams } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import { useState } from 'react';
import { CartItem } from '../types/CartItem';
import { useCart } from '../context/CartContext';

function AddCartPage() {
  const navigate = useNavigate();
  const { title, bookID, price } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(0);

  const numericPrice = Number(price) || 0; // ensure it's a number
  const subtotal = quantity * numericPrice;

  const handleAddToCart = () => {
    if (quantity <= 0) return; // prevent adding 0 quantity

    const newItem: CartItem = {
      bookID: Number(bookID),
      title: title || 'No book found',
      price: numericPrice,
      quantity,
    };
    addToCart(newItem);
    navigate('/cart');
  };

  return (
    <>
      <WelcomeBand />
      <h2>Buy "{title}"</h2>

      <div>
        <label>Add Quantity: </label>
        <input
          type="number"
          min={0}
          placeholder="Enter the quantity"
          value={quantity}
          onChange={(x) => setQuantity(Number(x.target.value))}
        />
      </div>

      <div>
        <strong>Price per book:</strong> ${numericPrice.toFixed(2)} <br />
        <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
      </div>

      <button onClick={handleAddToCart} disabled={quantity <= 0}>
        Add to Cart
      </button>

      <button onClick={() => navigate('/projects')}>Go back</button>
    </>
  );
}

export default AddCartPage;
