import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import VerifiedIcon from "@mui/icons-material/Verified";
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export const AdminList = () => {
    return(
        <List sx={{ width: 200 }}>
          <ListItem button>
            <ListItemIcon>
              <VerifiedIcon />
            </ListItemIcon>
            <ListItemText primary="Verifikacija" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
                <ReceiptIcon/>
            </ListItemIcon>
            <ListItemText primary="Porudžbine" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
                <PersonIcon/>
            </ListItemIcon>
            <ListItemText primary="Kupci" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
            <PersonOutlineIcon/>
            </ListItemIcon>
            <ListItemText primary="Prodavci" />
          </ListItem>
        </List>
    );
};

export const CustomerList = () => {
    return(
        <List sx={{ width: 200 }}>
          <ListItem button>
            <ListItemIcon>
                <ReceiptIcon/>
            </ListItemIcon>
            <ListItemText primary="Porudžbine" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
                <PersonIcon/>
            </ListItemIcon>
            <ListItemText primary="Kupci" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
            <PersonOutlineIcon/>
            </ListItemIcon>
            <ListItemText primary="Prodavci" />
          </ListItem>
        </List>
    );
};

export const SalesmanList = () => {
    return(
        <List sx={{ width: 200 }}>
          <ListItem button>
            <ListItemIcon>
              <VerifiedIcon />
            </ListItemIcon>
            <ListItemText primary="Moji proizvodi" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
                <ReceiptIcon/>
            </ListItemIcon>
            <ListItemText primary="Porudžbine" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
                <PersonIcon/>
            </ListItemIcon>
            <ListItemText primary="Kupci" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
            <PersonOutlineIcon/>
            </ListItemIcon>
            <ListItemText primary="Prodavci" />
          </ListItem>
        </List>
    );
};