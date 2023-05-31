import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { Link } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { getCurrentUser, logout } from '../../services/AuthService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Nav() {

  const navigate = useNavigate();
  const [user, setUser] = useState("");

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorElUser(null);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{bgcolor:"gray"}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Button component={Link} href="/" color="inherit">Pocetna strana</Button>
          </Typography>
          {!user && <>
            <Button component={Link} href="/register" color="inherit">Registrujte se</Button>
            <Button component={Link} href='/login' color="inherit">Ulogujte se</Button>
          </>}
          
          { user && <Box sx={{ flexGrow: 0 }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key="profil" component={Link} href='/profile' onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Profil</Typography>
                </MenuItem>
                <MenuItem key="logout" component={Link} href='/' onClick={handleLogout}>
                  <Typography textAlign="center">Izlogujte se</Typography>
                </MenuItem>
            </Menu>
          </Box>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}