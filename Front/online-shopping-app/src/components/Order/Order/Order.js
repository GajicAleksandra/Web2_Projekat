import { Divider, TableCell } from "@mui/material";
import styles from './Order.module.css'

const Order = (props) => {
const { orderItem } = props;

  return (
    <>
      <TableCell sx={{ width: 135,  textAlign: "center" }}>
        <img className={styles.image} src="/images/register.jpg"/>
      </TableCell>
      <TableCell className={styles.details}>
        {orderItem.product.name}
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
