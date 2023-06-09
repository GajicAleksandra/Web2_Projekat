import Nav from "../UI/Nav";
import "./Home.css";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Card, Typography } from "@mui/material";
import { Link } from "@mui/material";
import { useEffect, useState } from "react";
import { getUserRole } from "../../services/AuthService";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFCCCC",
    },
    secondary: {
      main: "#00ff00",
    },
  },
});

export default function Home() {
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(getUserRole());
  });

  return (
    <>
      <Nav></Nav>
      <div className="container">
        <img src="/images/home.png" alt="Home" className="image" />
        <div className="overlay"></div>
        <ThemeProvider theme={theme}>
          <Card
            sx={{ bgcolor: "black", opacity: 0.5, width: 1000, height: 350 }}
            className="text"
          ></Card>
          <div className="text">
            <Typography component="h2" sx={{ color: "white", width: 1000 }}>
              Dobrodošli na online prodavnicu ženskih parfema!
            </Typography>
            {role == 1 && (
              <Button
                variant="outlined"
                startIcon={<LocalMallIcon />}
                color="primary"
                size="large"
                sx={{ mt: 6 }}
                component={Link}
                href="/products"
              >
                Započnite kupovinu
              </Button>
            )}
          </div>
        </ThemeProvider>
      </div>
    </>
  );
}
