import React, { useEffect, useState } from "react";
import { Container, Grid, Button } from "@mui/material";
import Product from "../Product/Product";
import styles from "./ProductList.module.css";
import Nav from "../../UI/Nav";
import ProductModel from "../../../models/ProductModel";
import { getProducts } from "../../../services/ProductService";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { getUserRole } from "../../../services/AuthService";
import '../../Home/Home.css'

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchData();
    setRole(getUserRole());
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await getProducts()
      .then(function (response) {
        setProducts(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setLoading(false);
      });
  };

  return (
    <>
      <Nav></Nav>
      {loading ? (
        <div className="container">
          <div className="overlay"></div>
          <div className="text">
            <h2>Loading...</h2>
          </div>
        </div>
      ) : (
        <Container maxWidth="lg" className={styles.container}>
          <Grid container spacing={3}>
            <img className={styles.image} src="/images/banner.jpg" />
            {role == 2 && (
              <Button variant="outlined" className={styles.addProduct}>
                <AddCircleOutlineIcon sx={{ marginRight: "0.3rem" }} />
                <p className={styles.addProductText}>Dodaj proizvod</p>
              </Button>
            )}
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Product product={product} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </>
  );
};

export default ProductList;
