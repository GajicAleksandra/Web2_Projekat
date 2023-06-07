import React, { useState } from 'react';
import { Typography, Grid, Button, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import styles from './ProductDetails.module.css';

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
    <Grid container spacing={2} className={styles.container}>
      <Grid item xs={12} sm={6}>
        <img className={styles.image} src={product.image} alt={product.name} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="h5" className={styles.title}>
          {product.name}
        </Typography>
        <Typography variant="body1" className={styles.description}>
          Opis: {product.description}
        </Typography>
        <Typography variant="body1" className={styles.price}>
          Cijena: {product.price} rsd
        </Typography>
        {/* Ostali detalji proizvoda */}
        <div className={styles.quantity}>
          <Typography variant="body1" className={styles.quantityLabel}>
            Količina:
          </Typography>
          <div className={styles.quantityControls}>
            <IconButton
              aria-label="Smanji količinu"
              color="primary"
              onClick={handleDecreaseQuantity}
              className={styles.quantityButton}
            >
              <Remove />
            </IconButton>
            <Typography variant="body1" className={styles.quantityValue}>
              {quantity}
            </Typography>
            <IconButton
              aria-label="Povećaj količinu"
              color="primary"
              onClick={handleIncreaseQuantity}
              className={styles.quantityButton}
            >
              <Add />
            </IconButton>
          </div>
        </div>
        <Button variant="contained" color="primary" className={styles.addButton}>
          Dodaj u korpu
        </Button>
      </Grid>
    </Grid>
  );
};

export default ProductDetails;
