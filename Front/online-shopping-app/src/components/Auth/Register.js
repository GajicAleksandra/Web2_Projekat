import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { RegisterUser } from '../../services/AuthService';
import Nav from '../UI/Nav'
import RegisterVM from '../../models/RegisterVM'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultTheme = createTheme();

export default function Register() {

  const registerVM = new RegisterVM();

  const [userData, setUserData] = useState(JSON.parse(JSON.stringify(registerVM)));

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUserData({...userData, [name]: value});
    if(value === ''){
      document.getElementById(name+'Error').innerHTML = "Popunite obavezno polje.";
    }
    else{
      document.getElementById(name+'Error').innerHTML = "";
    }
  };

  const formSchema = Yup.object().shape({
    username: Yup.string()
      .required('Unesite korisničko ime.'),
    email: Yup.string()
      .required('Unesite email.')
      .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Neispravan format email-a."),
    name: Yup.string()
      .required('Unesite ime.'),
    lastName: Yup.string()
      .required('Unesite prezime.'),
    address: Yup.string()
      .required('Unesite adresu.'),
    password: Yup.string()
      .required('Unesite lozinku.')
      .min(6, 'Lozinka mora sadržati minimum 6 karaktera.'),
    confirmPassword: Yup.string()
      .required('Potvrdite lozinku.')
      .oneOf([Yup.ref('password')], 'Lozinke se ne poklapaju.'),
    userType: Yup.string()
      .required("Izaberite tip korisnika."),
    birthDate: Yup.string()
      .required("Unesite datum rođenja.")
  })
  
  const formOptions = { resolver: yupResolver(formSchema) }

  const {register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState
  const navigate = useNavigate();
    
  const onSubmit = async (data) => {
    console.log(data);
    data.image = "";
    await RegisterUser(data)
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
      navigate('/login');
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
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Nav></Nav>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 5
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'blue' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registrujte se
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                {...register("username")}
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Korisničko ime"
                  autoFocus
                  onChange={e => handleChange(e)}
                />
                <span id='usernameError' style={{color: "red"}}>{errors.username?.message}</span>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("email")}
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  onChange={e => handleChange(e)}
                />
                <span id='emailError' style={{color: "red"}}>{errors.email?.message}</span>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("name")}
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Ime"
                  onChange={e => handleChange(e)}
                />
                <span id='nameError' style={{color: "red"}}>{errors.name?.message}</span>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("lastName")}
                  required
                  fullWidth
                  id="lastName"
                  label="Prezime"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={e => handleChange(e)}
                />
                <span id='lastNameError' style={{color: "red"}}>{errors.lastName?.message}</span>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("address")}
                  required
                  fullWidth
                  id="address"
                  label="Adresa"
                  name="address"
                  onChange={e => handleChange(e)}
                />
                <span id='addressError' style={{color: "red"}}>{errors.address?.message}</span>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("birthDate")}
                  required
                  type="date"
                  bgcolor="transparent"
                  fullWidth
                  id="birthDate"
                  label="Datum rođenja"
                  InputLabelProps={{
                    shrink: true
                  }}
                  name="birthDate"
                  onChange={e => handleChange(e)}
                />
                <span id='birthDateError' style={{color: "red"}}>{errors.birthDate?.message}</span>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("password")}
                  required
                  fullWidth
                  name="password"
                  label="Lozinka"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={e => handleChange(e)}
                />
                <span id='passwordError' style={{color: "red", width: 200}}>{errors.password?.message}</span>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("confirmPassword")}
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Potvrdite lozinku"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  onChange={e => handleChange(e)}
                />
                <span id='confirmPasswordError' style={{color: "red"}}>{errors.confirmPassword?.message}</span>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" >
                  <InputLabel sx={{width: 120}} id="userType">Tip korisnika</InputLabel>
                    <Select
                      {...register("userType")}
                      labelId="userType"
                      id="userType"
                      label="Tip korisnika *"
                      value={userData.userType}
                      onChange={e => handleChange(e)}
                    >
                    <MenuItem value={1}>Kupac</MenuItem>
                    <MenuItem value={2}>Prodavac</MenuItem>
                  </Select>
                </FormControl>
                <span id='userTypeError' style={{color: "red"}}>{errors.userType?.message}</span>
              </Grid>
              <Grid item xs={12} sm={6}>
                
              </Grid>
            </Grid>
            <span style={{color: "red"}} id='registerError'></span>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registruj se
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Imate nalog? Ulogujte se
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}