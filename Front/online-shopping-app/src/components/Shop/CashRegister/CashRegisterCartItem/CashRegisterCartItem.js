import React from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import { IconButton, Button } from "@mui/material";
import styles from './CashRegisterCartItem.module.css'

const CashRegisterCartItem = ({ cartItem, increaseQuantity, decreaseQuantity, deleteItem }) => {
  const handleIncreaseQuantity = () => {
    increaseQuantity(cartItem.product.id);
  };

  const handleDecreaseQuantity = () => {
    decreaseQuantity(cartItem.product.id);
  };

  const handleRemoveItem = () => {
    deleteItem(cartItem.product.id);
  };

  return (
    <div className={styles.productDetails}>
      <img
        src={cartItem.product.image}
        alt={cartItem.product.name}
        className={styles.productImage}
      />
      <div className={styles.productText}>
        <p>{cartItem.product.name}</p>
        <p>{cartItem.product.price.toLocaleString("en-US")}.00 RSD</p>
      </div>
      <div className={styles.productActions}>
        <IconButton onClick={handleDecreaseQuantity} className={styles.minus}>
          <RemoveOutlinedIcon />
        </IconButton>
        <span id="cashRegisterCount" className={styles.plusMinus}>{cartItem.quantity}</span>
        <IconButton onClick={handleIncreaseQuantity} className={styles.plus}>
          <AddOutlinedIcon />
        </IconButton>
      </div>
      <Button onClick={handleRemoveItem} className={styles.delete} >
          <DeleteOutlineOutlinedIcon  />
        </Button>
    </div>
  );
};

export default CashRegisterCartItem;