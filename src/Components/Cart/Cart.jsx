import { BsFillCartFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const cart = useSelector((state) => state.cart.cart);

  return (
    <div className="cart-container">
      <Link to="/userCart" className="cart-link">
        <BsFillCartFill className="primary-color fs-2 ms-5 cursor-pointer" />
        {cart?.length > 0 && <span className="cart-badge">{cart.length}</span>}
      </Link>
    </div>
  );
};

export default Cart;
