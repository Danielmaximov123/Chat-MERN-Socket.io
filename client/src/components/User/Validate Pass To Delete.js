import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel } from '@mui/material'
import React, { useState } from 'react'
import CustomTextPassField from '../Custom Style/customTextPassField';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';

const ValidatePassToDelete = ({deleteUser , setDeleteUser , handleDelete , userData , bcrypt , socket}) => {
    const [password, setPassword] = useState({ password : '' , confirmPassword : '' })
    const [agree, setAgree] = useState(false)

    const check = (e) => {
        e.preventDefault()
        if(password.password !== password.confirmPassword) {
           return toast.error('The passwords do not match' , {position : toast.POSITION.BOTTOM_CENTER})
        }
        if(bcrypt.compareSync(password.password, userData.password)) {
            handleDelete()
            setPassword({ password : '' , confirmPassword : '' })
        } else {
            return toast.error('Authentication failed, please try again.' , {position : toast.POSITION.BOTTOM_CENTER})
        }
    }


  return (
    <Dialog
    fullWidth={true}
    maxWidth={'xs'}
    open={deleteUser}
    onClose={() => setDeleteUser(!deleteUser)}
    aria-labelledby="responsive-dialog-title"
  >
        <DialogActions>
      <Button sx={{position : 'absolute' , top : '1rem'}} size='large' color="error" autoFocus onClick={() => setDeleteUser(!deleteUser)}>
        X
      </Button>
    </DialogActions>
     <DialogTitle id="alert-dialog-title" sx={{textAlign : 'center'}}>
        Delete your Account
     </DialogTitle>
    <DialogContent sx={{textAlign : 'center'}}>
        <DialogContentText id="alert-dialog-description" >
        In order to the user, you will need to verify with your password
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
            <FormControlLabel checked={agree} onChange={e => setAgree(e.target.checked)} control={<Checkbox />} label="Agree to delete your user and chats?" />
        <LoadingButton disabled={!agree} sx={{ margin: '0.2rem' }} type='submit' fullWidth variant='contained' autoFocus>
        Delete your account
      </LoadingButton>
        </Box>
    </DialogContent>
  </Dialog>
  )
}

export default ValidatePassToDelete