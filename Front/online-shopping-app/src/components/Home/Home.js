import Nav from "../UI/Nav";
import "./Home.css";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Card, CardContent, Typography } from "@mui/material";
import { Link } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFCCCC", // Custom primary color
    },
    secondary: {
      main: "#00ff00", // Custom secondary color
    },
  },
});

export default function Home() {
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
              Dobrodošli na online prodavnicu parfema!
            </Typography>
            <Button
              variant="outlined"
              startIcon={<LocalMallIcon />}
              color="primary"
              size="large"
              sx={{ mt:6 }}
              component={Link}
              href="/products"
            >
              Započnite kupovinu
            </Button>
          </div>
        </ThemeProvider>
      </div>
    </>
  );
}
