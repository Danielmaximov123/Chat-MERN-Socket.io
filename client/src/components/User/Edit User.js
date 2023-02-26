import { Box } from '@mui/material'
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

const EditUser = ({user}) => {
    const dispatch = useDispatch()
    const [userData, setUserData] = useState({
        fName : '',
        lName : '',
        email : '',
        profilePicture : null
    })
    const [oldpassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [validatePass, setValidatePass] = useState(false)

    useEffect(() => {
        console.log(user);
    },[user , userData])


  return (
    <Box>EditUser</Box>
  )
}

export default EditUser