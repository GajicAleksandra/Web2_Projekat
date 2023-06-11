import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { getSalesmanStatus } from '../../services/UserService'
 
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 250,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};

export default function TransitionsModal({ open, setOpen }) {
  const [message, setMessage] = useState("");
  const [textColor, setColor] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await getSalesmanStatus()
    .then(function(response){
        if(response.data === 1){
            setMessage("Zahtev je prihvaćen.");
            setColor("green");
            localStorage.setItem('isVerified', true);
        }
        else if(response.data === 2){
            setMessage("Zahtev je odbijen.");
            setColor("red");
        }
        else{
            setMessage("Zahtev se obrađuje.");
            setColor("gray");
        }
    })
    .catch(function(error){
        
    });
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style} border={'2px solid ' + textColor}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Status verifikacije
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }} color={textColor}>
              {message}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
