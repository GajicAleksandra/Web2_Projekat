import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Nav from '../UI/Nav';
import { GetLoggedInUser, ChangeProfile } from '../../services/UserService';
import LoggedInUser from '../../models/LoggedInUser';

const defaultTheme = createTheme();

const Profile = () => {

  const user = new LoggedInUser();

  const navigate = useNavigate();
  const [userData, setUserData] = useState(JSON.parse(JSON.stringify(user)));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await GetLoggedInUser()
      .then(function(response){
          setUserData(JSON.parse(JSON.stringify(response.data))); 
          console.log(response.data)
      })
      .catch(function(error){
          console.log(error);
      });
  }

  const handleChange = (e) => {
    const {name, value} = e.target;
    if(value === ''){
      document.getElementById(name + 'Error').innerHTML = "Ovo polje je obavezno.";
    }
    else{
      document.getElementById(name + 'Error').innerHTML = "";
    }
    setUserData({...userData, [name]: value});
  }

  const onSubmit = async () => {
    console.log(userData);
    await ChangeProfile(userData)
      .then(function () {
        navigate("/");
      })
      .catch(function (error) {
        document.getElementById("registerError").innerHTML = error.response.data;
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Nav></Nav>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 5,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "blue" }}>
            <AccountCircleOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Profil
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={onSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Korisničko ime"
                  autoFocus
                  value={userData?.username}
                  onChange={e => handleChange(e)}
                />
                <span style={{ color: "red" }} id="usernameError"></span>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{ cursor: "not-allowed" }}
                  fullWidth
                  disabled
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={userData?.email}
                  onChange={e => handleChange(e)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Ime"
                  value={userData?.name}
                  onChange={e => handleChange(e)}
                />
                <span style={{ color: "red" }} id="nameError"></span>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Prezime"
                  name="lastName"
                  autoComplete="family-name"
                  value={userData?.lastName}
                  onChange={e => handleChange(e)}
                />
                <span style={{ color: "red" }} id="lastNameError"></span>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Adresa"
                  name="address"
                  value={userData?.address}
                  onChange={e => handleChange(e)}
                />
                <span style={{ color: "red" }} id="addressError"></span>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  type="date"
                  bgcolor="transparent"
                  fullWidth
                  id="birthDate"
                  label="Datum rođenja"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="birthDate"
                  value={userData?.birthDate?.split("T")[0]}
                  onChange={e => handleChange(e)}
                />
                <span style={{ color: "red" }} id="birthDateError"></span>
              </Grid>
            </Grid>
            <span style={{ color: "red" }} id="registerError"></span>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Izmeni podatke
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Profile;
