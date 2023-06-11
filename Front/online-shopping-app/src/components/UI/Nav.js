import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { Link, Drawer, Badge, Divider } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  getCurrentUser,
  logout,
  getUserRole,
  getImage,
} from "../../services/AuthService";
import { useState, useEffect } from "react";
import TransitionsModal from "./Modal";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Cart from "../Shop/Cart/Cart";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SideMenu from "./SideMenu";
import StorefrontIcon from '@mui/icons-material/Storefront';


export default function Nav(props) {
  const [user, setUser] = useState("");
  const [role, setRole] = useState(-1);
  const [image, setImage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [count, setCount] = useState(0);
  const open = Boolean(anchorEl);
  const openUser = Boolean(anchorElUser);

  const [isCartOpen, setCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  const handleOpenModal = () => {
    setAnchorElUser(null);
    setModalOpen(true);
  };

  useEffect(() => {
    setUser(getCurrentUser());
    setRole(getUserRole());
    setImage(getImage());

    var items = localStorage.getItem('cart');
    if(items){
      items = JSON.parse(items);
      setCount(items.length)
    }
    else{
      setCount(0);
    }

  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorElUser(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCount = (c) => {
    setCount(c);
  };

  const updateQuantity = (quantity) => {
    setCount(quantity);
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: "#FFCCCC", position: 'fixed', zIndex: 999 }}>
          <Toolbar>
            {user && (
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <SideMenu />
              </Typography>
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 900 }}>
              <IconButton sx={{ color: "black" }} component={Link} href="/">
                <HomeOutlinedIcon fontSize="medium" />
              </IconButton>
            </Typography>
            {role === "1" && <Typography variant="h6" component="div" sx={{ flexGrow: 1000000 }}>
              <IconButton sx={{ color: "black" }} component={Link} href="/products">
                <StorefrontIcon fontSize="medium" />
              </IconButton>
            </Typography>}
            {!user && (
              <>
                <Button
                  component={Link}
                  href="/register"
                  sx={{ color: "black" }}
                >
                  Registrujte se
                </Button>
                <Button component={Link} href="/login" sx={{ color: "black" }}>
                  Ulogujte se
                </Button>
              </>
            )}
            {user && (
              <Box sx={{ flexGrow: 0 }}>
                {role == 1 && props.show != "false" && <IconButton
                  aria-label="Korpa"
                  onClick={handleCartOpen}
                  sx={{ color: "black", marginRight: 2 }}
                >
                  <Badge id="badge" badgeContent={count} color="secondary" showZero>
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>}
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0, color: "black" }}
                >
                  {image != "" ? (
                    <Avatar alt="Remy Sharp" src={image} />
                  ) : (
                    <AccountCircleOutlinedIcon fontSize="large" />
                  )}
                </IconButton>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    key="profil"
                    component={Link}
                    href="/profile"
                    onClick={handleCloseUserMenu}
                    sx={{ height: "40px" }}
                  >
                    <AccountCircleOutlinedIcon style={{ marginRight: 10 }} />
                    Profil
                  </MenuItem>
                  <MenuItem
                    key="changepassword"
                    component={Link}
                    href="/changepassword"
                    onClick={handleCloseUserMenu}
                    sx={{ height: "40px" }}
                  >
                    <EditIcon style={{ marginRight: 10 }} />
                    Izmeni lozinku
                  </MenuItem>
                  {role == 2 && (
                    <MenuItem
                      key="verifikacija"
                      onClick={handleOpenModal}
                      sx={{ height: "40px" }}
                    >
                      <InfoOutlinedIcon style={{ marginRight: 10 }} />
                      Status verifikacije
                    </MenuItem>
                  )}
                  <Divider sx={{ mt: 1, mb: 1 }} />
                  <MenuItem
                    key="logout"
                    component={Link}
                    href="/"
                    onClick={handleLogout}
                    sx={{ height: "35px" }}
                  >
                    <LogoutIcon style={{ marginRight: 10 }} />
                    Izloguj se
                  </MenuItem>
                </Menu>
                <TransitionsModal open={modalOpen} setOpen={setModalOpen} />
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer anchor="right" open={isCartOpen} onClose={handleCartClose}>
        <Cart isOpen={isCartOpen} onClose={handleCartClose} updateQuantity={updateQuantity}/>
      </Drawer>
    </div>
  );
}
