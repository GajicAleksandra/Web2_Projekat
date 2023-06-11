import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { loginUser } from "../../services/AuthService";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Nav from "../UI/Nav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Paper from "@mui/material/Paper";
import LoginModel from '../../models/LoginModel'

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#FFCCCC",
    },
    secondary: {
      main: "#000000",
    },
  },
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    loginUser(data)
      .then(function (response) {
        var returnUrl = localStorage.getItem('returnUrl');

        if(returnUrl){
          window.location.href = returnUrl;
        }
        else{
          navigate("/");
        }
      })
      .catch(function (error) {
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
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(http://localhost:3000/images/login.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              mt: 6,
              mb: 3,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 5, bgcolor: "#FFCCCC", color: "black" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Ulogujte se
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                {...register("email", {
                  required: "Unesite email.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Pogrešan format email-a.",
                  },
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
              {errors.email && (
                <span style={{ color: "red" }}>{errors.email.message}</span>
              )}
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
              {errors.password && (
                <span style={{ color: "red" }}>{errors.password.message}</span>
              )}

              <span style={{ color: "red" }} id="error"></span>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Ulogujte se
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    href="/register"
                    variant="body2"
                    sx={{ color: "black" }}
                  >
                    {"Nemate nalog? Registrujte se"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Divider sx={{ ml: 4, mb: 3, width: 550 }}>ili</Divider>
          <LoginSocialFacebook
            appId="279895857806999"
            onResolve={(response) => {
              console.log(response);
            }}
            onReject={(error) => {
              console.log(error);
            }}
          >
            <FacebookLoginButton
              text="Facebook"
              style={{ marginLeft: 32, textAlign: "center", width: 555 }}
            />
          </LoginSocialFacebook>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
