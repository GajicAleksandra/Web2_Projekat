import React, { useState, useEffect } from "react";
import { IconButton, Link } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import styles from "./ProductDetails.module.css";
import ProductList from "../ProductList/ProductList";
import { useParams } from "react-router-dom";
import ProductModel from "../../../models/ProductModel";
import { getProduct } from "../../../services/ProductService";
import Nav from "../../UI/Nav";

const ProductDetails = () => {

  const product = new ProductModel();

  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState(
    JSON.parse(JSON.stringify(product))
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await getProduct(id)
      .then(function (response) {
        console.log(response.data);
        setProductData(JSON.parse(JSON.stringify(response.data)));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

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
    <>
    <Nav></Nav>
    <div className={styles.card}>
      <nav>
        <a className={styles.link} href="/products">
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
        </a>
      </nav>
      <div className={styles.photo}>
        <img src={productData.image} />
      </div>
      <div className={styles.description}>
        <h2>{productData.name}</h2>
        <h1>{productData.price.toLocaleString("en-US")}.00 RSD</h1>
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
    </>
    
  );
};

export default ProductDetails;
