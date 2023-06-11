import { Divider, TableCell } from "@mui/material";
import styles from './Order.module.css'

const Order = (props) => {
const { orderItem } = props;

  return (
    <>
    <TableCell sx={{ width: 135,  textAlign: "center" }}>
      <a href={`/details/${orderItem.product.id}`}>
        <img className={styles.image} src={orderItem.product.image}/>
      </a>
      </TableCell>
      <TableCell className={styles.details}>
      <a href={`/details/${orderItem.product.id}`} className={styles.link}>
        {orderItem.product.name}
      </a>
      </TableCell>
      <TableCell className={styles.details}>
        {orderItem.product.price.toLocaleString("en-US")}.00 RSD
      </TableCell>
      <TableCell className={styles.details}>
        {orderItem.quantity} kom
      </TableCell>
      <Divider/>
      </>
  );
};

export default Order;
