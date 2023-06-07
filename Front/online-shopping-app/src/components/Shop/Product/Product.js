import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import styles from './Product.module.css';

const Product = ({ product }) => {
  return (
    <Card className={styles.card}>
      <CardMedia className={styles.cardMedia} component="img" src={product.image} alt={product.name} />
      <CardContent>
        <div className={styles.productInfo}>
          <Typography variant="h6" component="h2" className={styles.title}>
            {product.name}
          </Typography>
          <Button variant="outlined" color="primary" className={styles.addButton} component={Link} to={`/details/${product.id}`}>
            Detalji
          </Button>
        </div>
        <Typography variant="body2" className={styles.description}>
          Opis: {product.description}
        </Typography>
        <Typography variant="body2" className={styles.price}>
          Cijena: {product.price} rsd
        </Typography>
        {/* Ostali detalji proizvoda */}
      </CardContent>
    </Card>
  );
};

export default Product;
