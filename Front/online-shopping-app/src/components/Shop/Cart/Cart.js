import React, { useEffect, useState } from "react";
import { Button, Divider, Link } from "@mui/material";
import styles from "./Cart.module.css";
import CloseIcon from "@mui/icons-material/Close";
import CartItem from "../CartItem/CartItem";
import ProductModel from "../../../models/ProductModel";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(0);
  var cartItems = [];

  const updateSummary = (cartItems) => {
    var s = 0;
    cartItems.forEach((element) => {
      s += element.quantity * element.product.price;
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
    var newProducts = products.filter((p) => p.product.id !== id);

    setProducts(newProducts);
    updateSummary(newProducts);
    var badge = parseInt(document.querySelector('[data-testid="ShoppingCartIcon"] + span.MuiBadge-badge').innerHTML);
    badge--;
    document.querySelector('[data-testid="ShoppingCartIcon"] + span.MuiBadge-badge').innerHTML = badge;
    localStorage.setItem("cart", JSON.stringify(newProducts));
  };

  const increaseQuantity = (id) => {
    var cartItem = products.find((p) => p.product.id === id);

    if(cartItem.quantity + 1 > cartItem.product.quantity){
      toast.error("Nema dovoljno proizvoda na stanju.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    
    cartItem.quantity++;

    setProducts(products);
    updateSummary(products);

    localStorage.setItem("cart", JSON.stringify(products));
  };

  const decreaseQuantity = (id) => {
    var cartItem = products.find((p) => p.product.id === id);
    if (cartItem.quantity === 1) {
      deleteItem(id);
    } else {
      cartItem.quantity--;
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
              <li key={cartItem.product.id} className={styles.productItem}>
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
            <Button component={Link} href="/checkout" variant="contained" className={styles.checkoutButton}>
              Idi na kasu
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;