import React, { useState } from "react";
import { Typography, Grid, Button, IconButton, Link } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import styles from "./ProductDetails.module.css";
import ProductList from "../ProductList/ProductList";

const ProductDetails = ({ product }) => {
  //useParams i sa servera dobavim taj proizvod
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className={styles.card}>
      <nav>
        <Link className={styles.link} to={ProductList}>
          <svg
            className={styles.arrow}
            version="1.1"
            viewBox="0 0 512 512"
            width="512px"
          >
            <polygon
              points="352,115.4 331.3,96 160,256 331.3,416 352,396.7 201.5,256"
              stroke="#727272"
            />
          </svg>
          Nazad
        </Link>
      </nav>
      <div className={styles.photo}>
        <img src="/images/register.jpg" />
      </div>
      <div className={styles.description}>
        <h2>{product.name}</h2>
        <h1>{product.price} RSD</h1>
        <p>
          Classic Peace Lily is a spathiphyllum floor plant arranged in a bamboo
          planter with a blue & red ribbom and butterfly pick.
        </p>
        <div className={styles.plusMinusDiv}>
          <IconButton onClick={handleDecreaseQuantity} className={styles.minus}>
            <RemoveOutlinedIcon />
          </IconButton>
          <span className={styles.plusMinus}>{quantity}</span>
          <IconButton onClick={handleIncreaseQuantity} className={styles.plus}>
            <AddOutlinedIcon />
          </IconButton>
        </div>
        <button className={styles.addToCartbutton}>Dodaj u korpu</button>
      </div>
    </div>
  );
};

export default ProductDetails;
