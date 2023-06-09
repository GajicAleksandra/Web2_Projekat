import React, { useEffect, useState } from "react";
import { Container, Grid, Button, Link } from "@mui/material";
import Product from "../Product/Product";
import styles from "./ProductList.module.css";
import Nav from "../../UI/Nav";
import ProductModel from "../../../models/ProductModel";
import { getProducts } from "../../../services/ProductService";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { getUserRole } from "../../../services/AuthService";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#FFCCCC", // Custom primary color
    },
    secondary: {
      main: "#000000", // Custom secondary color
    },
  },
});

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchData();
    setRole(getUserRole());
  }, []);

  const fetchData = async () => {
    await getProducts()
      .then(function (response) {
        setProducts(response.data);
      })
      .catch(function (error) {
        toast.error(error.response.data, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
  };

  return (
    <>
      <Nav></Nav>
      <ThemeProvider theme={defaultTheme}>
        <Container maxWidth="lg" className={styles.container}>
          <Grid container spacing={3} sx={{ marginBottom:1 }}>
            <div>
              <img className={styles.image} src="/images/banner.jpg" />
              {role == 2 && (
                <Button
                  component={Link}
                  href="/addproduct"
                  variant="outlined"
                  color="secondary"
                  className={styles.addProduct}
                >
                  <AddCircleOutlineIcon sx={{ marginRight: "0.3rem" }} />
                  <p className={styles.addProductText}>Dodaj proizvod</p>
                </Button>
              )}
            </div>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Product product={product} onDeleteProduct={handleDeleteProduct} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default ProductList;
