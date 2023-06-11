import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Product.module.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StyledMenu from "../../UI/StyledMenu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUserRole } from "../../../services/AuthService";
import { deleteProduct } from "../../../services/ProductService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartItemModel from '../../../models/CartItemModel'

const Product = ({ product, onDeleteProduct }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  var cartItems = [];
  const open = Boolean(anchorEl);
  const [productData, setProductData] = useState(product);

  useEffect(() => {
    setRole(getUserRole());
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    navigate("/editproduct/" + product.id);
  };

  const handleDeleteClick = async () => {
    await deleteProduct(product.id)
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
        onDeleteProduct(product.id);
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

  const checkQuantity = (quantity) => {
    if (quantity > product.quantity) {
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

  const addOneToCart = () => {
    var cart = localStorage.getItem("cart");
    console.log(cart);
    if (cart) {
      cartItems = JSON.parse(cart);
    } else {
      cartItems = [];
    }

    var existingItem = cartItems.find(function (i) {
      return i.product.id === product.id;
    });

    if (existingItem) {
      if (checkQuantity(existingItem.quantity + 1)) {
        existingItem.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cartItems));
        var badge = document.getElementById('badge').innerHTML;
      }
    } else {
      if (checkQuantity(1)) {
        var cartItem = new CartItemModel();
        cartItem.product = productData;
        cartItem.quantity = 1;
        cartItems.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cartItems));
        var badge = parseInt(document.querySelector('[data-testid="ShoppingCartIcon"] + span.MuiBadge-badge').innerHTML);
        badge++;
        document.querySelector('[data-testid="ShoppingCartIcon"] + span.MuiBadge-badge').innerHTML = badge;
      }
    }
  };

  return (
    <div className={styles.productCard}>
      {role == 2 && (
        <div className={styles.actions}>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleEditClick} disableRipple>
              <EditIcon />
              Izmeni
            </MenuItem>
            <MenuItem onClick={handleDeleteClick} disableRipple>
              <DeleteIcon />
              Obriši
            </MenuItem>
          </StyledMenu>
        </div>
      )}
      <div className={styles.productTumb}>
        <a href={"/details/" + product.id}>
          <img src={product.image} alt="" />
        </a>
      </div>
      <div className={styles.productDetails}>
        <span className={styles.productCatagory}>Ženski</span>
        <h4>
          <a href={"/details/" + product.id}>{product.name}</a>
        </h4>
        <p>
          {product.description.split('.')[0]}.
        </p>
        <div className={styles.productBottomDetails}>
          <div className={styles.productPrice}>
            {product.price.toLocaleString("en-US")}.00 RSD
          </div>
          <div className={styles.productLinks}>
            {role == "1" && <IconButton sx={{ color: "black" }} onClick={addOneToCart}>
              <ShoppingCartIcon />
            </IconButton>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
