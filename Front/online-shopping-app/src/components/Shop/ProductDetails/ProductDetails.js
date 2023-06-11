import React, { useState, useEffect } from "react";
import { IconButton, Link } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import styles from "./ProductDetails.module.css";
import ProductList from "../ProductList/ProductList";
import { useNavigate, useParams } from "react-router-dom";
import ProductModel from "../../../models/ProductModel";
import { getProduct } from "../../../services/ProductService";
import Nav from "../../UI/Nav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartItemModel from "../../../models/CartItemModel";
import { getUserRole } from "../../../services/AuthService";

const ProductDetails = () => {
  const product = new ProductModel();

  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState(
    JSON.parse(JSON.stringify(product))
  );

  const [role, setRole] = useState("");
  const navigate = useNavigate();
  var cartItems = [];

  useEffect(() => {
    fetchData();
    setRole(getUserRole());
  }, []);

  const fetchData = async () => {
    await getProduct(id)
      .then(function (response) {
        setProductData(JSON.parse(JSON.stringify(response.data)));
      })
      .catch(function (error) {
        if (error.response.status === 401) {
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

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const checkQuantity = (quantity) => {
    if (quantity > productData.quantity) {
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

      return false;
    }
    return true;
  };

  const addToCart = () => {
    var cart = localStorage.getItem("cart");
    console.log(cart);
    if (cart) {
      cartItems = JSON.parse(cart);
    } else {
      cartItems = [];
    }

    var existingItem = cartItems.find(function (i) {
      return i.product.id === productData.id;
    });

    if (existingItem) {
      if (checkQuantity(existingItem.quantity + quantity)) {
        existingItem.quantity += quantity;
        localStorage.setItem("cart", JSON.stringify(cartItems));
      }
    } else {
      if (checkQuantity(quantity)) {
        var cartItem = new CartItemModel();
        cartItem.product = productData;
        cartItem.quantity = quantity;
        cartItems.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cartItems));
        var badge = parseInt(document.querySelector('[data-testid="ShoppingCartIcon"] + span.MuiBadge-badge').innerHTML);
        badge++;
        document.querySelector('[data-testid="ShoppingCartIcon"] + span.MuiBadge-badge').innerHTML = badge;
      }
    }
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
          <p>{productData.description}</p>
          {role == "1" && (
            <div className={styles.plusMinusDiv}>
              <IconButton
                onClick={handleDecreaseQuantity}
                className={styles.minus}
              >
                <RemoveOutlinedIcon />
              </IconButton>
              <span className={styles.plusMinus}>{quantity}</span>
              <IconButton
                onClick={handleIncreaseQuantity}
                className={styles.plus}
              >
                <AddOutlinedIcon />
              </IconButton>
            </div>
          )}
          {role == "1" && (
            <button className={styles.addToCartbutton} onClick={addToCart}>
              Dodaj u korpu
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
