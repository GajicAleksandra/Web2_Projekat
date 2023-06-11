import * as React from "react";
import PropTypes from "prop-types";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Nav from "../../UI/Nav";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Divider, Button } from "@mui/material";
import {
  getOrders,
  getSalesmanOrders,
  getCustomerOrders,
  cancelOrder,
} from "../../../services/OrderService";
import Order from "../Order/Order";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./OrderList.module.css";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const getFormattedDate = (date) => {
    var d = date.split("T");
    var s = d[0].split("-");
    var year = s[0];
    var month = s[1];
    var day = s[2];

    s = d[1].split(":");

    var hours = s[0];
    var minutes = s[1];

    return `${day}.${month}.${year}. ${hours}:${minutes}`;
  };

  const calculateTime = () => {
    if (props.type == "new") {
      var timeOfMakingOrder = new Date(row.timeOfMakingOrder);
      var now = new Date();

      var timeDiff = now.getTime() - timeOfMakingOrder.getTime();
      var hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

      if (hoursDiff < 1) {
        return true;
      }
    }

    return false;
  };

  const handleCancelOrder = () => {
    props.onCancelOrder(row.id);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={{ width: 50, textAlign: "center" }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ textAlign: "center" }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ fontWeight: "bold", width: 50 }}
        >
          #{row.id}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ width: 100, textAlign: "center" }}
        >
          {row.name}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ width: 100, textAlign: "center" }}
        >
          {row.lastName}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ width: 150, textAlign: "center" }}
        >
          {row.address}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ width: 110, textAlign: "center" }}
        >
          {row.totalAmount.toLocaleString("en-US")}.00 RSD
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ width: 150, textAlign: "center" }}
        >
          {getFormattedDate(row.timeOfMakingOrder)}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ width: 130, textAlign: "center" }}
        >
          {getFormattedDate(row.timeOfDelivery)}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ width: 150, textAlign: "center" }}
        >
          {row.comment}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ width: 70, textAlign: "center" }}
        >
          {row.orderStatus == "isporuceno" && (
            <p style={{ color: "green" }}>Isporučeno</p>
          )}
          {row.orderStatus == "otkazano" && (
            <p style={{ color: "red" }}>Otkazano</p>
          )}
          {props.type == "new" && calculateTime() && (
            <Button className={styles.cancel} onClick={handleCancelOrder}>
              Otkaži
            </Button>
          )}
          {row.orderStatus == "u toku" && !calculateTime() && (
            <p style={{ color: "gray" }}>U toku</p>
          )}
        </TableCell>
        <TableCell
                sx={{
                  width: 70,
                  textAlign: "center",
                }}
              >
                Preostalo vreme
              </TableCell>
        
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {row.orderItems.map((orderItem) => (
              <Paper sx={{ margin: 1, backgroundColor: "beige" }}>
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    <Order orderItem={orderItem} />
                  </TableBody>
                </Table>
              </Paper>
            ))}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    timeOfMakingOrder: PropTypes.string.isRequired,
    timeOfDelivery: PropTypes.string.isRequired,
    orderStatus: PropTypes.number.isRequired,
    totalAmount: PropTypes.number.isRequired,
    orderItems: PropTypes.array.isRequired,
  }).isRequired,
};

export function AdminOrderList(props) {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    await getOrders()
      .then(function (response) {
        setRows(response.data.reverse());
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Nav></Nav>
      <div style={{ position: "absolute" }}>
        <TableContainer
          component={Paper}
          sx={{ width: 1300, marginTop: 15, marginLeft: 12, marginBottom: 20 }}
        >
          <h1 style={{ textAlign: "center", marginTop: 15, marginBottom: 15 }}>
            Sve porudžbine
          </h1>
          <Divider />
          <Table aria-label="collapsible table">
            <TableHead sx={{ backgroundColor: "beige" }}>
              <TableCell sx={{ width: 80 }}></TableCell>
              <TableCell sx={{ width: 60, fontWeight: "bold", fontSize: 18 }}>
                Id
              </TableCell>
              <TableCell
                sx={{
                  width: 130,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Ime
              </TableCell>
              <TableCell
                sx={{
                  width: 200,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Prezime
              </TableCell>
              <TableCell
                sx={{
                  width: 200,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Adresa
              </TableCell>
              <TableCell
                sx={{
                  width: 200,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Iznos
              </TableCell>
              <TableCell
                sx={{
                  width: 200,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Vreme poručivanja
              </TableCell>
              <TableCell
                sx={{
                  width: 200,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Vreme dostave
              </TableCell>
              <TableCell
                sx={{
                  width: 100,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Status
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                sx={{ width: 5, textAlign: "center" }}
              ></TableCell>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <Row key={row.id} row={row} type={props.additionalProp} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export const SalesmanOrderList = () => {
  const { type } = useParams();
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    await getSalesmanOrders(type)
      .then(function (response) {
        setRows(response.data.reverse());

        console.log(rows);
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Nav></Nav>
      <div style={{ position: "absolute" }}>
        <TableContainer
          component={Paper}
          sx={{ width: 1470, marginTop: 12, marginLeft: 0, marginBottom: 20 }}
        >
          <h1 style={{ textAlign: "center", marginTop: 15, marginBottom: 15 }}>
            {type == "new" && "Nove porudžbine"}
            {type == "previous" && "Prethodne porudžbine"}
          </h1>
          <Divider />
          <Table aria-label="collapsible table">
            <TableHead sx={{ backgroundColor: "beige" }}>
              <TableCell sx={{ width: 50 }}></TableCell>
              <TableCell sx={{ width: 50, fontWeight: "bold", fontSize: 18 }}>
                Id
              </TableCell>
              <TableCell
                sx={{
                  width: 100,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Ime
              </TableCell>
              <TableCell
                sx={{
                  width: 100,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Prezime
              </TableCell>
              <TableCell
                sx={{
                  width: 150,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Adresa
              </TableCell>
              <TableCell
                sx={{
                  width: 110,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Iznos
              </TableCell>
              <TableCell
                sx={{
                  width: 150,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Vreme poručivanja
              </TableCell>
              <TableCell
                sx={{
                  width: 130,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Vreme dostave
              </TableCell>
              <TableCell
                sx={{
                  width: 150,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Komentar
              </TableCell>
              <TableCell
                sx={{
                  width: 70,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  width: 70,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Preostalo vreme
              </TableCell>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export const CustomerOrderList = () => {
  const { type } = useParams();
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    await getCustomerOrders(type)
      .then(function (response) {
        setRows(response.data.reverse());
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelOrder = async (id) => {
    await cancelOrder(id)
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

        setRows(rows.filter((r) => r.id != id));
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
      <Nav></Nav>
      <div style={{ position: "absolute" }}>
        <TableContainer
          component={Paper}
          sx={{ width: 1470, marginTop: 12, marginLeft: 0, marginBottom: 20 }}
        >
          <h1 style={{ textAlign: "center", marginTop: 15, marginBottom: 15 }}>
            {type == "new" && "Nove porudžbine"}
            {type == "previous" && "Prethodne porudžbine"}
          </h1>
          <Divider />
          <Table aria-label="collapsible table">
            <TableHead sx={{ backgroundColor: "beige" }}>
              <TableCell sx={{ width: 50 }}></TableCell>
              <TableCell sx={{ width: 50, fontWeight: "bold", fontSize: 18 }}>
                Id
              </TableCell>
              <TableCell
                sx={{
                  width: 100,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Ime
              </TableCell>
              <TableCell
                sx={{
                  width: 100,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Prezime
              </TableCell>
              <TableCell
                sx={{
                  width: 150,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Adresa
              </TableCell>
              <TableCell
                sx={{
                  width: 110,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Iznos
              </TableCell>
              <TableCell
                sx={{
                  width: 150,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Vreme poručivanja
              </TableCell>
              <TableCell
                sx={{
                  width: 130,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Vreme dostave
              </TableCell>
              <TableCell
                sx={{
                  width: 150,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Komentar
              </TableCell>
              <TableCell
                sx={{
                  width: 70,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  width: 70,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                Preostalo vreme
              </TableCell>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  type={type}
                  onCancelOrder={handleCancelOrder}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};
