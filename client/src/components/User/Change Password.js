import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useState } from 'react'
import CustomTextPassField from '../Custom Style/customTextPassField';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';

const ChangePassword = ({changePass , setChangePass , handleSubmit , userData , bcrypt}) => {
  const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState({ password : '' , confirmPassword : '' })

    const check = (e) => {
        e.preventDefault()
        if(password.password !== password.confirmPassword) {
           return toast.error('The passwords do not match' , {position : toast.POSITION.TOP_CENTER})
        }
        if(bcrypt.compareSync(oldPassword, userData.password)) {
            handleSubmit(userData)
            setPassword({ password : '' , confirmPassword : '' })
        } else {
            return toast.error('Authentication failed, please try again.' , {position : toast.POSITION.TOP_CENTER})
        }
    }

  return (
    <Dialog
    fullWidth={true}
    maxWidth={'xs'}
    open={changePass}
    onClose={() => setChangePass(!changePass)}
    aria-labelledby="responsive-dialog-title"
  >
        <DialogActions>
      <Button sx={{position : 'absolute' , top : '1rem'}} size='large' color="error" autoFocus onClick={() => setChangePass(!changePass)}>
        X
      </Button>
    </DialogActions>
     <DialogTitle id="alert-dialog-title" sx={{textAlign : 'center'}}>
        Change User Password
     </DialogTitle>
    <DialogContent sx={{textAlign : 'center'}}>
        <DialogContentText id="alert-dialog-description" >
        In order to update the password, you will need to verify with your password
        </DialogContentText>
        <Box component='form' onSubmit={check} sx={{ margin : '1rem 0rem' }}>
            <CustomTextPassField
            fullWidth 
            sx={{ margin: '0.2rem' }}
            label="Old Password"
            value={oldPassword || ''}
            variant="outlined"
            onChange={e => setOldPassword(e.target.value)}
            />
            <CustomTextPassField
            fullWidth 
            sx={{ margin: '0.2rem' }}
            label="New Password"
            value={password.password || ''}
            variant="outlined"
            onChange={e => setPassword({...password , password : e.target.value})}
            />
            <CustomTextPassField
            fullWidth
            sx={{ margin: '0.2rem' }}
            label="Confirm New Password"
            value={password.confirmPassword || ''}
            variant="outlined"
            onChange={e => setPassword({...password , confirmPassword : e.target.value})}
            />
        <LoadingButton sx={{ margin: '0.2rem' }} type='submit' fullWidth variant='contained' autoFocus>
        Change The Password
      </LoadingButton>
        </Box>
    </DialogContent>
  </Dialog>
  )
}

export default ChangePassword