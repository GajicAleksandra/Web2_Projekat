import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import Product from '../Product/Product';
import styles from './ProductList.module.css';
import Nav from '../../UI/Nav';
import ProductModel from '../../../models/ProductModel'
import { getProducts } from '../../../services/ProductService'

const ProductList = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await getProducts()
    .then(function(response){
      setProducts(response.data);
    })
    .catch(function(error){
      console.log(error);
    });
  };

  return (
    <>
    <Nav></Nav>
    <Container maxWidth="lg" className={styles.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" align="center" className={styles.title}>
            Prikaz proizvoda
          </Typography>
        </Grid>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Product product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
    </>
  );
};

export default ProductList;
