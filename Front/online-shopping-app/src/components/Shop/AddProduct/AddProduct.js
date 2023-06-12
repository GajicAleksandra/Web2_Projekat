import React, { useState, useEffect } from "react";
import styles from "./AddProduct.module.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Nav from "../../UI/Nav";
import { Card } from "@mui/material";
import "../../User/Profile.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ProductModel from "../../../models/ProductModel";
import { addProduct } from "../../../services/ProductService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#00ff00",
    },
  },
});

const AddProduct = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const product = ProductModel;
  const [productData, setProductData] = useState(product);

  function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      document.getElementById(name + "Error").innerHTML =
        "Ovo polje je obavezno.";
    } else {
      document.getElementById(name + "Error").innerHTML = "";
    }
    setProductData({ ...productData, [name]: value });
  };

  const onSubmit = async () => {
    if (productData.image == "/images/product-placeholder.png") {
      document.getElementById("imageError").innerHTML = "Izaberite sliku.";
      return;
    }

    if (
      productData.name === "" ||
      productData.price === "" ||
      productData.quantity === "" ||
      productData.description === ""
    ) {
      document.getElementById("editProductError").innerHTML =
        "Popunite obavezna polja.";
      return;
    }

    if(!isNumber(productData.price) || productData.price <= 0){
      document.getElementById("priceError").innerHTML = "Cena mora biti pozitivan broj.";
      return;
    }

    if(!isNumber(productData.quantity) || productData.quantity <= 0){
      document.getElementById("quantityError").innerHTML = "Količina mora biti pozitivan broj.";
      return;
    }

    productData.id = 0;

    await addProduct(productData)
      .then(function (response) {
        toast.success(response.data, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        navigate("/products");
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.clear();
          localStorage.setItem("returnUrl", window.location.href);
          navigate("/login");
        } else if (error.response.status === 403) {
          toast.error("Niste autorizovani za ovu akciju.", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        else{
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
        }
      });
  };

  const showPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setProductData({
          ...productData,
          image: x.target.result,
        });
      };
      reader.readAsDataURL(imageFile);
    } else {
      setProductData({
        ...productData,
        image: "/images/product-placeholder.png",
      });
    }
  };

  return (
    <>
      <Nav></Nav>
      <div className="container">
        <img src="/images/home.png" alt="Home" className="image" />
        <div className="overlay"></div>
        <ThemeProvider theme={defaultTheme}>
          <Card
            sx={{
              mt: 6.5,
              bgcolor: "#FFCCCC",
              width: 800,
              height: 650,
            }}
            className="text"
          ></Card>
          <div className="text" style={{ marginLeft: -20 }}>
            <Grid container>
              <Grid item xs={12} className={styles.heading}>
                <div className={styles.icon}>
                  <Avatar sx={{ m: 1, color: "#FFCCCC", bgcolor: "black" }}>
                    <AddCircleOutlineIcon />
                  </Avatar>
                  <Typography
                    component="h1"
                    variant="h5"
                    sx={{ color: "black" }}
                  >
                    Dodaj proizvod
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className={styles.imageContainer}>
                  {productData.image == "" ? (
                    <img
                      className={styles.image}
                      src="/images/product-placeholder.png"
                      alt="Selected Product"
                    />
                  ) : (
                    <img
                      className={styles.image}
                      src={productData.image}
                      alt="Selected Product"
                    />
                  )}
                  <input
                    className={styles.chooseImage}
                    type="file"
                    onChange={showPreview}
                  />
                </div>
                <span
                  style={{ color: "red", float: "left", marginLeft: 40 }}
                  id="imageError"
                ></span>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ marginRight: "0%" }}>
                <Box
                  sx={{
                    marginTop: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 5,
                  }}
                >
                  <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ height: "300px" }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          {...register("name", { required: "Unesite naziv." })}
                          autoComplete="name"
                          name="name"
                          required
                          fullWidth
                          id="name"
                          label="Naziv"
                          autoFocus
                          onChange={(e) => handleChange(e)}
                          color="primary"
                        />
                        <span
                          style={{ color: "red", float: "left" }}
                          id="nameError"
                        >
                          {errors.name?.message}
                        </span>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          {...register("price", { required: "Unesite cenu." })}
                          fullWidth
                          required
                          id="price"
                          label="Cena"
                          name="price"
                          onChange={(e) => handleChange(e)}
                        />
                        <span
                          style={{ color: "red", float: "left" }}
                          id="priceError"
                        >
                          {errors.price?.message}
                        </span>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          {...register("quantity", {
                            required: "Unesite količinu.",
                          })}
                          name="quantity"
                          required
                          fullWidth
                          id="quantity"
                          label="Količina"
                          onChange={(e) => handleChange(e)}
                        />
                        <span style={{ color: "red" }} id="quantityError">
                          {errors.quantity?.message}
                        </span>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          {...register("description", {
                            required: "Unesite opis.",
                          })}
                          multiline
                          rows={6}
                          required
                          fullWidth
                          id="description"
                          label="Opis"
                          name="description"
                          onChange={(e) => handleChange(e)}
                        />
                        <span
                          style={{ color: "red", float: "left" }}
                          id="descriptionError"
                        >
                          {errors.description?.message}
                        </span>
                      </Grid>
                    </Grid>
                    <span style={{ color: "red" }} id="editProductError"></span>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 6, mb: 1 }}
                      >
                        Dodaj
                      </Button>
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </div>
        </ThemeProvider>
      </div>
    </>
  );
};

export default AddProduct;
