import React from "react";
import styles from "./CartItem.module.css";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import { IconButton, Button, Divider } from "@mui/material";

const CartItem = ({ cartItem, increaseQuantity, decreaseQuantity, deleteItem }) => {
  const handleIncreaseQuantity = () => {
    increaseQuantity(cartItem.id);
  };

  const handleDecreaseQuantity = () => {
    decreaseQuantity(cartItem.id);
  };

  const handleRemoveItem = () => {
    deleteItem(cartItem.id);
  };

  return (
    <div className={styles.productDetails}>
      <img
        src={cartItem.image}
        alt={cartItem.name}
        className={styles.productImage}
      />
      <div className={styles.productText}>
        <p>{cartItem.name}</p>
        <p>{cartItem.price.toLocaleString("en-US")}.00 RSD</p>
      </div>
      <div className={styles.productActions}>
        <IconButton onClick={handleDecreaseQuantity} className={styles.minus}>
          <RemoveOutlinedIcon />
        </IconButton>
        <span className={styles.plusMinus}>{cartItem.quantity}</span>
        <IconButton onClick={handleIncreaseQuantity} className={styles.plus}>
          <AddOutlinedIcon />
        </IconButton>
      </div>
      <Button onClick={handleRemoveItem} className={styles.delete} >
          <DeleteOutlineOutlinedIcon  />
        </Button>
    </div>
  );
};

export default CartItem;

// import React, { useContext } from "react";
// import styles from "./CartItem.module.css";
// import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
// import { IconButton, Button, Divider } from "@mui/material";
// import { CartContext } from "../Cart/CartContext";

// const CartItem = ({ cartItem }) => {
//   const { increaseQuantity, decreaseQuantity, removeItem } = useContext(CartContext);

//   const handleIncreaseQuantity = () => {
//     increaseQuantity(cartItem.id);
//   };

//   const handleDecreaseQuantity = () => {
//     decreaseQuantity(cartItem.id);
//   };

//   const handleRemoveItem = () => {
//     removeItem(cartItem.id);
//   };

//   return (
//     <div className={styles.productDetails}>
//       <img
//         src={cartItem.image}
//         alt={cartItem.name}
//         className={styles.productImage}
//       />
//       <div className={styles.productText}>
//         <p>{cartItem.name}</p>
//         <p>{cartItem.price.toLocaleString("en-US")}.00 RSD</p>
//       </div>
//       <div className={styles.productActions}>
//         <IconButton onClick={handleDecreaseQuantity} className={styles.minus}>
//           <RemoveOutlinedIcon />
//         </IconButton>
//         <span className={styles.plusMinus}>{cartItem.quantity}</span>
//         <IconButton onClick={handleIncreaseQuantity} className={styles.plus}>
//           <AddOutlinedIcon />
//         </IconButton>
//       </div>
//       <Button onClick={handleRemoveItem} className={styles.delete}>
//         <DeleteOutlineOutlinedIcon />
//       </Button>
//     </div>
//   );
// };

// export default CartItem;






