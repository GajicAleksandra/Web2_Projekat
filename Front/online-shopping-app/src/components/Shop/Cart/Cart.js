import React, { useEffect, useState } from "react";
import { Button, Divider } from "@mui/material";
import styles from "./Cart.module.css";
import CloseIcon from "@mui/icons-material/Close";
import CartItem from "../CartItem/CartItem";
import ProductModel from "../../../models/ProductModel";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = ({ isOpen, onClose, updateQuantity }) => {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(0);
  var cartItems = [];

  const updateSummary = (cartItems) => {
    var s = 0;
    cartItems.forEach((element) => {
      s += element.quantity * element.price;
    });

    setSummary(s);
  };

  useEffect(() => {
    var cart = localStorage.getItem("cart");
    if (cart) {
      cartItems = JSON.parse(cart);
    } else {
      cartItems = [];
    }

    setProducts(cartItems);
    updateSummary(cartItems);
  }, []);

  const handleDelete = (id) => {
    deleteItem(id);
  };

  const deleteItem = (id) => {
    var newProducts = products.filter((p) => p.id !== id);

    setProducts(newProducts);
    updateSummary(newProducts);
    localStorage.setItem("cart", JSON.stringify(newProducts));
  };

  const increaseQuantity = (id) => {
    var product = products.find((p) => p.id === id);
    product.quantity++;

    setProducts(products);
    updateSummary(products);

    localStorage.setItem("cart", JSON.stringify(products));
  };

  const decreaseQuantity = (id) => {
    var product = products.find((p) => p.id === id);
    if (product.quantity === 1) {
      deleteItem(id);
    } else {
      product.quantity--;
      setProducts(products);
      updateSummary(products);
      localStorage.setItem("cart", JSON.stringify(products));
    }
  };

  return (
    <div className={isOpen ? styles.cartOpen : styles.cartClosed}>
      <div className={styles.cartHeader}>
        <h4>Moja korpa</h4>
        <button className={styles.cartCloseButton} onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      {products.length === 0 ? (
        <p className={styles.emptyCart}>Korpa je prazna</p>
      ) : (
        <>
          <ul className={styles.productList}>
            {products.map((cartItem) => (
              <li key={cartItem.id} className={styles.productItem}>
                <CartItem
                  cartItem={cartItem}
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                  deleteItem={handleDelete}
                />
              </li>
            ))}
          </ul>
          <Divider sx={{ mt: 1, mb: 1 }} />
          <div className={styles.checkout}>
            <p className={styles.summary}>
              Ukupno: {summary.toLocaleString("en-US")}.00 RSD
            </p>
            <Button variant="contained" className={styles.checkoutButton}>
              Idi na kasu
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

// import React, { useEffect, useState, useContext } from "react";
// import { Button, Divider } from "@mui/material";
// import styles from "./Cart.module.css";
// import CloseIcon from "@mui/icons-material/Close";
// import CartItem from "../CartItem/CartItem";
// import { CartContext } from "./CartContext";

// const Cart = ({ isOpen, onClose }) => {
//   const { cartItems, increaseQuantity, decreaseQuantity, removeItem } = useContext(CartContext);
//   const [summary, setSummary] = useState(0);

//   useEffect(() => {
//     const calculateSummary = () => {
//       let s = 0;
//       cartItems.forEach((element) => {
//         s += element.quantity * element.price;
//       });
//       setSummary(s);
//     };

//     calculateSummary();
//   }, [cartItems]);

//   const handleDelete = (id) => {
//     removeItem(id);
//   };

//   return (
//     <div className={isOpen ? styles.cartOpen : styles.cartClosed}>
//       <div className={styles.cartHeader}>
//         <h4>Moja korpa</h4>
//         <button className={styles.cartCloseButton} onClick={onClose}>
//           <CloseIcon />
//         </button>
//       </div>
//       {cartItems.length === 0 ? (
//         <p className={styles.emptyCart}>Korpa je prazna</p>
//       ) : (
//         <>
//           <ul className={styles.productList}>
//             {cartItems.map((cartItem) => (
//               <li key={cartItem.id} className={styles.productItem}>
//                 <CartItem
//                   cartItem={cartItem}
//                   increaseQuantity={increaseQuantity}
//                   decreaseQuantity={decreaseQuantity}
//                   deleteItem={handleDelete}
//                 />
//               </li>
//             ))}
//           </ul>
//           <Divider sx={{ mt: 1, mb: 1 }} />
//           <div className={styles.checkout}>
//             <p className={styles.summary}>
//               Ukupno: {summary.toLocaleString("en-US")}.00 RSD
//             </p>
//             <Button variant="contained" className={styles.checkoutButton}>
//               Idi na kasu
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Cart;
