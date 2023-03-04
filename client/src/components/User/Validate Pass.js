import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useState } from 'react'
import CustomTextPassField from './../Custom Style/customTextPassField';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import bcrypt from "bcryptjs-react";

const ValidatePass = ({open , setOpen , handleSubmit , user}) => {
    const [password, setPassword] = useState({ password : '' , confirmPassword : '' })

    const check = (e) => {
        e.preventDefault()
        console.log('ok');
        if(password.password !== password.confirmPassword) {
           return toast.error('The passwords do not match' , {position : toast.POSITION.TOP_CENTER})
        }
        if(bcrypt.compareSync(password.password, user.password)) {
            handleSubmit(user)
            setPassword({ password : '' , confirmPassword : '' })
        } else {
            return toast.error('Authentication failed, please try again.' , {position : toast.POSITION.TOP_CENTER})
        }
    }

  return (
    <Dialog
    fullWidth={true}
    maxWidth={'xs'}
    open={open}
    onClose={() => setOpen(!open)}
    aria-labelledby="responsive-dialog-title"
  >
        <DialogActions>
      <Button sx={{position : 'absolute' , top : '1rem'}} size='large' color="error" autoFocus onClick={() => setOpen(!open)}>
        X
      </Button>
    </DialogActions>
     <DialogTitle id="alert-dialog-title" sx={{textAlign : 'center'}}>
        Verify your Account
     </DialogTitle>
    <DialogContent sx={{textAlign : 'center'}}>
        <DialogContentText id="alert-dialog-description" >
        In order to update the details, you will need to verify with your password
        </DialogContentText>
        <Box component='form' onSubmit={check} sx={{ margin : '1rem 0rem' }}>
            <CustomTextPassField
            fullWidth 
            sx={{ margin: '0.2rem' }}
            label="Password"
            value={password.password || ''}
            variant="outlined"
            onChange={e => setPassword({...password , password : e.target.value})}
            />
            <CustomTextPassField
            fullWidth
            sx={{ margin: '0.2rem' }}
            label="Confirm Password"
            value={password.confirmPassword || ''}
            variant="outlined"
            onChange={e => setPassword({...password , confirmPassword : e.target.value})}
            />
        <LoadingButton sx={{ margin: '0.2rem' }} type='submit' fullWidth variant='contained' autoFocus>
        Verify your account
      </LoadingButton>
        </Box>
    </DialogContent>
  </Dialog>
  )
}

export default ValidatePass