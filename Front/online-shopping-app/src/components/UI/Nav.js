import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { Link, Drawer, Badge } from "@mui/material";
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

export default function Nav() {
  const [user, setUser] = useState("");
  const [role, setRole] = useState(-1);
  const [image, setImage] = useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

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

  const getRequests = (e) => {
    var status = e.currentTarget.id;
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: "#FFCCCC" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <IconButton sx={{ color: "black" }} component={Link} href="/">
                <HomeOutlinedIcon fontSize="large" />
              </IconButton>
            </Typography>
            {user && role == 0 && (
              <div>
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  sx={{ mr: 2, color: "black" }}
                >
                  Zahtevi za verifikaciju
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    component={Link}
                    href="/pendingrequests"
                    id="pending"
                    onClick={getRequests}
                  >
                    Na čekanju
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    href="/acceptedrequests"
                    id="accepted"
                    onClick={getRequests}
                  >
                    Prihvaćeni
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    href="/rejectedrequests"
                    id="rejected"
                    onClick={getRequests}
                  >
                    Odbijeni
                  </MenuItem>
                </Menu>
              </div>
            )}
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
                <IconButton
                  aria-label="Korpa"
                  onClick={handleCartOpen}
                  sx={{ color: "black", paddingRight:3 }}
                >
                  <Badge badgeContent={0} color="secondary" showZero>
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
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
                  >
                    <Typography textAlign="center">Profil</Typography>
                  </MenuItem>
                  {role == 2 && (
                    <>
                      <MenuItem key="verifikacija" onClick={handleOpenModal}>
                        <Typography textAlign="center">
                          Status verifikacije
                        </Typography>
                      </MenuItem>
                      <TransitionsModal
                        open={modalOpen}
                        setOpen={setModalOpen}
                      />
                    </>
                  )}

                  <MenuItem
                    key="logout"
                    component={Link}
                    href="/"
                    onClick={handleLogout}
                  >
                    <Typography textAlign="center">Izlogujte se</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer anchor="right" open={isCartOpen} onClose={handleCartClose}>
        <Cart isOpen={isCartOpen} onClose={handleCartClose} />
      </Drawer>
    </div>
  );
}
