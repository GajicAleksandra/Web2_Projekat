import * as React from "react";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { getUserRole, isVerified } from '../../services/AuthService'
import { AdminList, CustomerList, SalesmanList } from "./SideMenuList";


export default function SideMenu() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [role, setRole] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    setRole(getUserRole());
    setVerified(isVerified())
  });

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIsDrawerOpen(open);
  };

  console.log(verified);

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)} sx={{ color: "black" }}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        {role == 0 && <AdminList/>}
        {role == 1 && <CustomerList/>}
        {role == 2 && verified && <SalesmanList/>}
      </Drawer>
    </div>
  );
}
