import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import VerifiedIcon from "@mui/icons-material/Verified";
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Link } from "@mui/material";
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';

export const AdminList = () => {
    return(
        <List sx={{ width: 200 }}>
          <ListItem button component={Link} href="/pendingrequests">
            <ListItemIcon>
              <VerifiedIcon />
            </ListItemIcon>
            <ListItemText primary="Verifikacija" />
          </ListItem>
          <ListItem button component={Link} href="/adminorders">
            <ListItemIcon>
                <ReceiptIcon/>
            </ListItemIcon>
            <ListItemText primary="Porudžbine" />
          </ListItem>
          <ListItem button component={Link} href="/customers">
            <ListItemIcon>
                <PersonIcon/>
            </ListItemIcon>
            <ListItemText primary="Kupci" />
          </ListItem>
          <ListItem button component={Link} href="/salesmen">
            <ListItemIcon>
            <PersonOutlineIcon/>
            </ListItemIcon>
            <ListItemText primary="Prodavci" />
          </ListItem>
          <ListItem button component={Link} href="/products">
            <ListItemIcon>
            <StorefrontIcon/>
            </ListItemIcon>
            <ListItemText primary="Proizvodi" />
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
        <List sx={{ width: 250 }}>
          <ListItem button component={Link} href="/products">
            <ListItemIcon>
            <StorefrontIcon/>
            </ListItemIcon>
            <ListItemText primary="Moji proizvodi" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
                <ReceiptIcon/>
            </ListItemIcon>
            <ListItemText primary="Nove porudžbine" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
                <ReceiptOutlinedIcon/>
            </ListItemIcon>
            <ListItemText primary="Moje porudžbine" />
          </ListItem>
        </List>
    );
};