import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Product.module.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUserRole } from '../../../services/AuthService'
import { deleteProduct } from '../../../services/ProductService'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const Product = ({ product, onDeleteProduct }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [role, setRole] = useState(""); 
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

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
    navigate('/editproduct/' + product.id);
  };

  const handleDeleteClick = async () => {
    await deleteProduct(product.id)
    .then(function(response){
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
    .catch(function(error){
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
  }

  return (
    <div className={styles.productCard}>
      {role == 2 && <div className={styles.actions}>
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
      </div>}

      <div className={styles.productTumb}>
        <a href={'/details/' + product.id}><img src={product.image} alt="" /></a>
      </div>
      <div className={styles.productDetails}>
        <span className={styles.productCatagory}>Ženski</span>
        <h4>
          <a href={'/details/' + product.id}>{product.name}</a>
        </h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero,
          possimus nostrum!
        </p>
        <div className={styles.productBottomDetails}>
          <div className={styles.productPrice}>
            {product.price.toLocaleString("en-US")}.00 RSD
          </div>
          <div className={styles.productLinks}>
            <IconButton sx={{ color: "black" }}>
              <ShoppingCartIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
