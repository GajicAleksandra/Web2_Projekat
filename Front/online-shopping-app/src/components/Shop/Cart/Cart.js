import React from "react";
import { Button } from "@mui/material";
import styles from "./Cart.module.css";
import CloseIcon from "@mui/icons-material/Close";
import CartItem from "../CartItem/CartItem";

const products = [
  {
    id: 1,
    name: "Proizvod 1",
    price: 10,
    image: "http://localhost:3000/images/login.jpg",
    description: "kdbewakjwebkbe",
  },
  {
    id: 2,
    name: "Proizvod 2",
    price: 15,
    image: "http://localhost:3000/images/register.jpg",
    description: "kdbewakjwebkbe",
  },
  {
    id: 3,
    name: "Proizvod 3",
    price: 20,
    image: "http://localhost:3000/images/login.jpg",
    description: "kdbewakjwebkbe",
  },
  {
    id: 4,
    name: "Proizvod 1",
    price: 10,
    image: "http://localhost:3000/images/login.jpg",
    description: "kdbewakjwebkbe",
  },
  {
    id: 5,
    name: "Proizvod 2",
    price: 15,
    image: "http://localhost:3000/images/login.jpg",
    description: "kdbewakjwebkbe",
  },
  {
    id: 6,
    name: "Proizvod 3",
    price: 20,
    image: "http://localhost:3000/images/login.jpg",
    description: "kdbewakjwebkbe",
  },
  {
    id: 7,
    name: "Proizvod 3",
    price: 20,
    image: "http://localhost:3000/images/login.jpg",
    description: "kdbewakjwebkbe",
  },
  {
    id: 8,
    name: "Proizvod 3",
    price: 20,
    image: "http://localhost:3000/images/login.jpg",
    description: "kdbewakjwebkbe",
  },
];

const Cart = ({ isOpen, onClose }) => {
  return (
    <div className={isOpen ? styles.cartOpen : styles.cartClosed}>
      <div className={styles.cartHeader}>
        <h4>Moja korpa</h4>
        <button className={styles.cartCloseButton} onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      {products.length === 0 ? (
        <p>Korpa je prazna</p>
      ) : (
        <ul className={styles.productList}>
          {products.map((cartItem) => (
            <li key={cartItem.id} className={styles.productItem}>
              <CartItem cartItem={cartItem} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
