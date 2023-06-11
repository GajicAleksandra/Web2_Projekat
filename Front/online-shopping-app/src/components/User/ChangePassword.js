import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Nav from "../UI/Nav";
import { Card } from "@mui/material";
import "./Profile.css";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ChangePasswordModel from "../../models/ChangePasswordModel";
import { changePassword } from "../../services/UserService";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#00ff00",
    },
  },
});

const ChangePassword = () => {

    const model = ChangePasswordModel;
    const [data, setData] = useState(model);
    const navigate = useNavigate();

    const formSchema = Yup.object().shape({
        cpPassword: Yup.string()
          .required("Unesite trenutnu lozinku."),
        cpNewPassword: Yup.string()
          .required("Unesite novu lozinku.")
          .min(6, "Lozinka mora sadržati minimum 6 karaktera."),
        cpConfirmPassword: Yup.string()
          .required("Potvrdite lozinku.")
          .oneOf([Yup.ref("cpNewPassword")], "Lozinke se ne poklapaju.")
      });

      const formOptions = { resolver: yupResolver(formSchema) };

      const { register, handleSubmit, formState } = useForm(formOptions);
      const { errors } = formState;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    if (value === "") {
      document.getElementById(name + "Error").innerHTML =
        "Popunite obavezno polje.";
    } else {
      document.getElementById(name + "Error").innerHTML = "";
    }
  };

  const onSubmit = async (data) => {
    await changePassword(data)
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
          navigate("/");
    })
    .catch(function(error){
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

  return (
    <>
      <Nav></Nav>
      <div className="container">
        <img src="/images/home.png" alt="Home" className="image" />
        <div className="overlay"></div>
        <ThemeProvider theme={defaultTheme}>
          <Card
            sx={{
              mt: 6.5,
              bgcolor: "#FFCCCC",
              width: 600,
              height: 500,
            }}
            className="text"
          ></Card>
          <div className="text">
            <Container component="main" maxWidth="sm" sx={{ mt: 15, width: 420 }}>
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
                <Avatar sx={{ m: 1, bgcolor: "black", color: "#FFCCCC" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ color: "black" }}>
                  Izmeni lozinku
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        {...register("cpPassword")}
                        required
                        fullWidth
                        name="cpPassword"
                        label="Trenutna lozinka"
                        type="password"
                        id="cpPassword"
                        autoComplete="new-password"
                        onChange={(e) => handleChange(e)}
                      />
                      <span
                        id="cpPasswordError"
                        style={{ color: "red", width: 200, float: 'left' }}
                      >
                        {errors.cpPassword?.message}
                      </span>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        {...register("cpNewPassword")}
                        required
                        fullWidth
                        name="cpNewPassword"
                        label="Nova lozinka"
                        type="password"
                        id="cpNewPassword"
                        autoComplete="new-password"
                        onChange={(e) => handleChange(e)}
                      />
                      <span id="cpNewPasswordError" style={{ color: "red", float: 'left' }}>
                        {errors.cpNewPassword?.message}
                      </span>
                    </Grid>

                    <Grid item xs={12}>
                    <TextField
                        {...register("cpConfirmPassword")}
                        required
                        fullWidth
                        name="cpConfirmPassword"
                        label="Potvrdi lozinku"
                        type="password"
                        id="cpConfirmPassword"
                        autoComplete="new-password"
                        onChange={(e) => handleChange(e)}
                      />
                      <span id="cpConfirmPasswordError" style={{ color: "red", float: 'left' }}>
                        {errors.cpConfirmPassword?.message}
                      </span>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                  >
                    Izmeni lozinku
                  </Button>
                </Box>
              </Box>
            </Container>
          </div>
        </ThemeProvider>
      </div>
    </>
  );
};

export default ChangePassword;
