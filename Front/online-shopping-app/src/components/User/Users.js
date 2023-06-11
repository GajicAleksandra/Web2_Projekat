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
import { getUsers } from "../../services/UserService";
import "react-toastify/dist/ReactToastify.css";
import { Divider, Avatar } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import VerifiedIcon from "@mui/icons-material/Verified";
import BlockIcon from "@mui/icons-material/Block";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const getFormattedDate = (birthDate) => {
    var date = birthDate.split('T');
    var s = date[0].split('-');
    var year = s[0];
    var month = s[1];
    var day = s[2];

    return `${day}.${month}.${year}.`;
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
        {props.type == "salesmen" && (
          <TableCell>
            {row.status == "0" && (
              <PendingActionsIcon style={{ color: "gray" }} />
            )}
            {row.status == "1" && <VerifiedIcon style={{ color: "green" }} />}
            {row.status == "2" && <BlockIcon style={{ color: "red" }} />}
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Paper sx={{ margin: 1, backgroundColor: 'beige' }}>
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

export function Users(props) {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    await getUsers(props.additionalProp)
      .then(function (response) {
        setRows(response.data);
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Nav></Nav>
      <div style={{ position: "absolute" }}>
        <TableContainer
          component={Paper}
          sx={{ width: 1100, marginTop: 15, marginLeft: 25 }}
        >
          <h1 style={{ textAlign: "center", marginTop: 15, marginBottom: 15 }}>
            {props.additionalProp == "customers" && "Kupci"}
            {props.additionalProp == "salesmen" && "Prodavci"}
          </h1>
          <Divider />
          <Table aria-label="collapsible table">
            <TableBody>
              {rows.map((row) => (
                <Row key={row.name} row={row} type={props.additionalProp} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
