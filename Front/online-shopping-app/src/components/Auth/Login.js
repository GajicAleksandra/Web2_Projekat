import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LoginUser } from '../../services/AuthService';
import { LoginSocialFacebook } from 'reactjs-social-login';
import { FacebookLoginButton } from 'react-social-login-buttons';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Nav from '../UI/Nav'

const defaultTheme = createTheme();

export default function Login() {

  const {register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    LoginUser(data)
    .then(function(response){
      navigate('/');
    })
    .catch(function(error){
      document.getElementById('error').innerHTML = error.response.data;
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Nav></Nav>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ulogujte se
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
              {...register("email", { 
                required: "Unesite email.", 
                pattern: { 
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 
                  message: "Pogrešan format email-a." 
                } 
              })}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            { errors.email && <span style={{color: "red"}}>{errors.email.message}</span> }
            <TextField
              {...register("password", { required: "Unesite lozinku." })}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Lozinka"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            { errors.password && <span style={{color: "red"}}>{errors.password.message}</span> }

            <span style={{color: "red"}} id='error'></span>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Ulogujte se
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Nemate nalog? Registrujte se"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Divider sx={{mt: 3, mb:3, borderBottomWidth: 20}}>ili</Divider>
        <LoginSocialFacebook
          appId='279895857806999'
          onResolve={(response) => {
            console.log(response);
          }}
          onReject={(error) => {
            console.log(error);
          }}>
          <FacebookLoginButton/>
        </LoginSocialFacebook>
      </Container>
    </ThemeProvider>
  );
}