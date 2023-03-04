import { IconButton, InputAdornment, TextField } from '@mui/material'
import React, { useState } from 'react'
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const CustomTextPassField = (props) => {
    const [showPass, setShowPass] = useState({ password: false, confirm: false });
  return (
    <TextField
          {...props}
          type={showPass.password ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
            <IconButton
              onClick={() =>
                showPass.password
                  ? setShowPass({ ...showPass, password: false })
                  : setShowPass({ ...showPass, password: true })
              }
              edge="end"
            >
              {!showPass.password ? (
                <VisibilityIcon/>
              ) : (
                <VisibilityOffIcon/>
              )}
            </IconButton>
          </InputAdornment>
          ),
        }}
        />
  )
}

export default CustomTextPassField