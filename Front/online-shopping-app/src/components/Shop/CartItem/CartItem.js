import React from "react";
import styles from "./CartItem.module.css";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { IconButton } from "@mui/material";

const CartItem = ({ cartItem }) => {
  const handleIncreaseQuantity = () => {
    // Logika za povećanje količine proizvoda
  };

  const handleDecreaseQuantity = () => {
    // Logika za smanjenje količine proizvoda
  };

  const handleRemoveItem = () => {
    // Logika za uklanjanje proizvoda iz korpe
  };

  return (
    <div className={styles.productDetails}>
      <img
        src={cartItem.image}
        alt={cartItem.name}
        className={styles.productImage}
      />
      <div className={styles.productText}>
        <p>{cartItem.name}</p>
        <p>Cena: {cartItem.price}</p>
      </div>
      <div className={styles.productActions}>
      <IconButton onClick={handleDecreaseQuantity} className={styles.minus}>
          <RemoveOutlinedIcon />
        </IconButton>
        <span className={styles.plusMinus}>0</span>
        <IconButton onClick={handleIncreaseQuantity} className={styles.plus}>
          <AddOutlinedIcon  />
        </IconButton>
        <IconButton onClick={handleRemoveItem} className={styles.delete}>
          <DeleteOutlineOutlinedIcon  />
        </IconButton>
      </div>
    </div>
  );
};

export default CartItem;
