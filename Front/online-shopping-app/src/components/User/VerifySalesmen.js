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
import Nav from "../UI/Nav";
import { useEffect, useState } from "react";
import {
  getAllSalesmen,
  acceptOrRejectSalesman,
} from "../../services/UserService";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Divider, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoggedInUser from '../../models/LoggedInUser';
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const getFormattedDate = (birthDate) => {
    var date = birthDate.split("T");
    var s = date[0].split("-");
    var year = s[0];
    var month = s[1];
    var day = s[2];

    return `${day}.${month}.${year}.`;
  };

  const handleClick = async (e) => {
    var id = e.currentTarget.id;
    var action = id.split("-")[0];
    var email = id.split("-")[1];

    await acceptOrRejectSalesman(action, email)
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
        props.refreshTable();
      })
      .catch(function (error) {
        if (error.response.status == 401) {
          localStorage.clear();
          localStorage.setItem("returnUrl", window.location.href);
          navigate("/login");
        } else if (error.response.status == 403) {
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
          return;
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
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <IconButton sx={{ p: 0, color: "black" }}>
            {row.image != "" ? (
              <Avatar alt="Remy Sharp" src={row.image} />
            ) : (
              <AccountCircleOutlinedIcon fontSize="large" />
            )}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell>{row.lastName}</TableCell>
        <TableCell align="center">
          <Button
            id={"accept-" + row.email}
            variant="contained"
            sx={{ mt: 2, mb: 2, mr: 2, width: 100, bgcolor: "green" }}
            onClick={handleClick}
          >
            Prihvati
          </Button>
          <Button
            id={"reject-" + row.email}
            variant="contained"
            sx={{ mt: 2, mb: 2, width: 100, bgcolor: "red" }}
            onClick={handleClick}
          >
            Odbij
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Paper sx={{ margin: 1, backgroundColor: "beige" }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: 135,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Korisničko ime
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 200,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 200,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Adresa
                    </TableCell>
                    <TableCell
                      sx={{
                        width: 200,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Datum rođenja
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.username} sx={{ height: 70 }}>
                    <TableCell
                      sx={{ width: 135, textAlign: "center" }}
                      component="th"
                      scope="row"
                    >
                      {row.username}
                    </TableCell>
                    <TableCell sx={{ width: 200, textAlign: "center" }}>
                      {row.email}
                    </TableCell>
                    <TableCell sx={{ width: 200, textAlign: "center" }}>
                      {row.address}
                    </TableCell>
                    <TableCell sx={{ width: 200, textAlign: "center" }}>
                      {getFormattedDate(row.birthDate)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
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
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    birthDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default function VerifySalesmen(props) {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSalesmen();
  }, []);

  const getSalesmen = async () => {
    console.log(props.additionalProp);
    await getAllSalesmen(props.additionalProp)
      .then(function (response) {
        let user = LoggedInUser;
        user = response.data;
        setRows(user);
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
          return;
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

  const refreshTable = async () => {
    await getSalesmen();
  };

  return (
    <>
      <Nav></Nav>
      <div style={{ position: "absolute", marginBottom: 10 }}>
        <TableContainer
          component={Paper}
          sx={{ width: 1100, marginTop: 15, marginLeft: 25 }}
        >
          {props.additionalProp == "Pending" && (
            <h1
              style={{ textAlign: "center", marginTop: 15, marginBottom: 10 }}
            >
              Zahtevi za verifikaciju
            </h1>
          )}
          {props.additionalProp == "Accepted" && (
            <h1 style={{ textAlign: "center" }}>Prihvaćeni zahtevi</h1>
          )}
          {props.additionalProp == "Rejected" && (
            <h1 style={{ textAlign: "center" }}>Odbijeni zahtevi</h1>
          )}
          <Divider />
          <Table aria-label="collapsible table">
            <TableBody>
              {rows.map((row) => (
                <Row
                  key={row.name}
                  row={row}
                  status={props.additionalProp}
                  refreshTable={refreshTable}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
