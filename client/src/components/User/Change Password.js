import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useState } from 'react'
import CustomTextPassField from '../Custom Style/customTextPassField';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { getChangePasswordUser } from '../../redux/action/AuthAction';

const ChangePassword = ({changePass , setChangePass  , user , bcrypt ,}) => {
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState({ password : '' , confirmPassword : '' })

  const isEnglishWord = (str) => {
    return /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(str);
  }

    const check = async (e) => {
        e.preventDefault()
        if(!isEnglishWord(password.password) || !isEnglishWord(password.confirmPassword)) {
          return toast.error('The password must be in English letters, numbers and symbols.' , {position : toast.POSITION.BOTTOM_CENTER})
        }
        if(password.password !== password.confirmPassword) {
           return toast.error('The passwords do not match' , {position : toast.POSITION.BOTTOM_CENTER})
        }
        let data = await getChangePasswordUser(user._id , {password : password.password , oldPassword})
        if(data.success) {
          setPassword({ password : '' , confirmPassword : '' })
          setOldPassword('')
          toast.success(data.message , {position : toast.POSITION.BOTTOM_CENTER})
          setChangePass(!changePass)
        } else {
            return toast.error(data.message , {position : toast.POSITION.BOTTOM_CENTER})
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