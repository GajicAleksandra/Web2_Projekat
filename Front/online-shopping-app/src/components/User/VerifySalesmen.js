import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Nav from "../UI/Nav";
import { useEffect, useState } from "react";
import { getAllSalesmen, acceptOrRejectSalesman } from "../../services/UserService"
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const handleClick = async (e) => {
    var id = (e.currentTarget.id);
    var action = id.split('-')[0];
    var email = id.split('-')[1];

    await acceptOrRejectSalesman(action, email)
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
        navigate('/verifysalesmen');
    })
    .catch(function(error){

    });
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
          {row.name}
        </TableCell>
        <TableCell>{row.lastName}</TableCell>
        <TableCell align='center'>
          <Button
            id={"accept-"+row.email}
            variant="contained"
            sx={{ mt: 2, mb: 2, mr: 2, width:100, bgcolor: 'green' }}
            onClick={handleClick}
          >
            Prihvati
          </Button>
          <Button
            id={"reject-"+row.email}
            variant="contained"
            sx={{ mt: 2, mb: 2, width:100, bgcolor: 'red' }}
            onClick={handleClick}
          >
            Odbij
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h5" gutterBottom component="div" sx={{ textAlign: 'center' }}>
                Detalji
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width:135 }}>Korisničko ime</TableCell>
                    <TableCell sx={{ width:200 }}>Email</TableCell>
                    <TableCell sx={{ width:200 }}>Adresa</TableCell>
                    <TableCell sx={{ width:200 }}>Datum rođenja</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                <TableRow key={row.username} sx={{ height:70 }}>
                      <TableCell sx={{ width:135 }} component="th" scope="row">
                        {row.username}
                      </TableCell>
                      <TableCell sx={{ width:200 }}>{row.email}</TableCell>
                      <TableCell sx={{ width:200 }}>{row.address}</TableCell>
                      <TableCell sx={{ width:200 }}>{row.birthDate}</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </Box>
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

export default function VerifySalesmen() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    getSalesmen();
  }, []);  

  const getSalesmen = async () => {
    await getAllSalesmen()
    .then(function(response){
      setRows(response.data);
    })
    .catch(function(error){

    });
  }

  return (
    <>
      <Nav></Nav>
      <h1 style={{ textAlign:'center' }}>Verifikacija prodavaca</h1>
      <TableContainer component={Paper} sx={{ width:1100, margin:'auto' }}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell sx={{ width:200 }}>Ime</TableCell>
            <TableCell sx={{ width:200 }}>Prezime</TableCell>
            <TableCell align='center' sx={{ width:400 }}>Verifikacija</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
      </TableContainer>
    </>
  );
}
