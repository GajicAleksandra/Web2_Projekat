import React from "react";
import { Grid, Paper, TextField, Button, Divider, Link } from "@mui/material";
import Nav from "../../UI/Nav";
import styles from "./CashRegister.module.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import CashRegisterCartItem from "./CashRegisterCartItem/CashRegisterCartItem";
import LoggedInUser from "../../../models/LoggedInUser";
import { getLoggedInUser } from "../../../services/UserService";
import CashRegisterModel from "../../../models/CashRegisterModel";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../../../services/OrderService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const CashRegister = () => {
  const user = LoggedInUser;
  const cashRegister = CashRegisterModel;
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(0);
  const [summarySummary, setSummarySummary] = useState(0);
  const [userData, setUserData] = useState(JSON.parse(JSON.stringify(user)));
  const [crData, setCrData] = useState(
    JSON.parse(JSON.stringify(cashRegister))
  );
  const [salesmenCount, setSalesmenCount] = useState(1);
  const navigate = useNavigate();
  var cartItems = [];

  const fetchData = async () => {
    await getLoggedInUser()
      .then(function (response) {
        setUserData(JSON.parse(JSON.stringify(response.data)));
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
        } else {
          console.log(error.response.data);
        }
      });
  };

  const updateSalesmenCount = (cartItems) => {
    var idCount = new Set();

    for (var i = 0; i < cartItems.length; i++) {
      var obj = cartItems[i];
      var salesmanId = obj.product.salesmanId;
      idCount.add(salesmanId);
    }
    setSalesmenCount(idCount.size);
    return idCount.size;
  };

  const updateSummary = (cartItems) => {
    var s = 0;
    cartItems.forEach((element) => {
      s += element.quantity * element.product.price;
    });

    var count = updateSalesmenCount(cartItems);
    setSummary(s);
    setSummarySummary(s + (count * 200));
  };

  useEffect(() => {
    var cart = localStorage.getItem("cart");
    if (cart) {
      cartItems = JSON.parse(cart);
    } else {
      cartItems = [];
    }

    setProducts(cartItems);
    updateSummary(cartItems);

    fetchData();
  }, []);

  useEffect(() => {
    cashRegister.name = userData.name;
    cashRegister.lastName = userData.lastName;
    cashRegister.address = userData.address;
    cashRegister.orderItems = products.map((p) => ({
      productId: p.product.id,
      quantity: p.quantity,
    }));
    cashRegister.comment = "";

    setCrData(JSON.parse(JSON.stringify(cashRegister)));
  }, [userData]);

  const handleDelete = (id) => {
    deleteItem(id);
  };

  const deleteItem = (id) => {
    var newProducts = products.filter((p) => p.product.id !== id);
    setCrData({
      ...crData,
      orderItems: newProducts.map((p) => ({
        productId: p.product.id,
        quantity: p.quantity,
      })),
    });
    setProducts(newProducts);
    updateSummary(newProducts);

    localStorage.setItem("cart", JSON.stringify(newProducts));
  };

  const increaseQuantity = (id) => {
    var cartItem = products.find((p) => p.product.id === id);

    if (cartItem.quantity + 1 > cartItem.product.quantity) {
      toast.error("Nema dovoljno proizvoda na stanju.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    cartItem.quantity++;

    setCrData({
      ...crData,
      orderItems: products.map((p) => ({
        productId: p.product.id,
        quantity: p.quantity,
      })),
    });
    setProducts(products);
    updateSummary(products);

    localStorage.setItem("cart", JSON.stringify(products));
  };

  const decreaseQuantity = (id) => {
    var cartItem = products.find((p) => p.product.id === id);
    if (cartItem.quantity === 1) {
      deleteItem(id);
    } else {
      cartItem.quantity--;
      setCrData({
        ...crData,
        orderItems: products.map((p) => ({
          productId: p.product.id,
          quantity: p.quantity,
        })),
      });
      setProducts(products);
      updateSummary(products);
      localStorage.setItem("cart", JSON.stringify(products));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      document.getElementById(name + "Error").innerHTML =
        "Ovo polje je obavezno.";
    } else {
      document.getElementById(name + "Error").innerHTML = "";
    }
    setCrData({ ...crData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (crData.orderItems.length == 0) {
      document.getElementById("error").innerHTML =
        "Dodajte proizvode koje želite da poručite.";
      return;
    }

    if (crData.name === "" || crData.lastName === "" || crData.address === "") {
      document.getElementById("error").innerHTML = "Popunite obavezna polja.";
      return;
    }

    crData.comment = document.getElementById("comment").value;

    console.log(crData);

    await placeOrder(crData)
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

        localStorage.removeItem('cart');
        navigate('/customerorders/new')
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
        } else {
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

  return (
    <>
      <Nav show="false"></Nav>
      <ThemeProvider theme={defaultTheme}>
        <Grid container spacing={2} className={styles.container}>
          <Grid item xs={6} className={styles.cart}>
            <>
              <ul className={styles.productList}>
                {products.map((cartItem) => (
                  <Paper
                    key={cartItem.product.id}
                    className={styles.productPaper}
                  >
                    <li
                      key={cartItem.product.id}
                      className={styles.productItem}
                    >
                      <CashRegisterCartItem
                        cartItem={cartItem}
                        increaseQuantity={increaseQuantity}
                        decreaseQuantity={decreaseQuantity}
                        deleteItem={handleDelete}
                      />
                    </li>
                  </Paper>
                ))}
              </ul>
              <Divider sx={{ mt: 1, mb: 1 }} />
              <p className={styles.summary}>
                Ukupno: {summary.toLocaleString("en-US")}.00 RSD
              </p>
              <p className={styles.summary}>Dostava: {salesmenCount} x 200.00 RSD</p>
              <Divider sx={{ mt: 1, mb: 1 }} />
              <p className={styles.summary}>
                Za plaćanje: {summarySummary.toLocaleString("en-US")}.00 RSD
              </p>
              <p className={styles.note}>
                *Cena dostave je srazmerna broju prodavaca od kojih naručujete proizvode
              </p>
            </>
          </Grid>
          <Grid item xs={6}>
            <Paper className={styles.info}>
              <form onSubmit={onSubmit}>
                <Grid container spacing={2} justifyContent="center">
                  <div className={styles.infoInput}>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            id="name"
                            name="name"
                            required
                            label="Ime"
                            fullWidth
                            value={crData.name}
                            className={styles.input}
                            onChange={(e) => handleChange(e)}
                          />
                          <span style={{ color: "red" }} id="nameError"></span>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            id="lastName"
                            name="lastName"
                            required
                            label="Prezime"
                            fullWidth
                            value={crData.lastName}
                            className={styles.input}
                            onChange={(e) => handleChange(e)}
                          />
                          <span
                            style={{ color: "red" }}
                            id="lastNameError"
                          ></span>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="address"
                        name="address"
                        required
                        label="Adresa"
                        fullWidth
                        value={crData.address}
                        className={styles.input}
                        onChange={(e) => handleChange(e)}
                      />
                      <span style={{ color: "red" }} id="addressError"></span>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="comment"
                        name="comment"
                        multiline
                        rows={4}
                        label="Komentar"
                        fullWidth
                        className={styles.input}
                      />
                    </Grid>
                  </div>
                  <span style={{ color: "red" }} id="error"></span>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={styles.order}
                    >
                      Kupi
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default CashRegister;
