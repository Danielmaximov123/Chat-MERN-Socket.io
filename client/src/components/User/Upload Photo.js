import { Box, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material';
import { useState ,useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useDispatch, useSelector } from 'react-redux';
import { updateProfilePic } from '../../redux/action/UserAction';
import { deleteProfilePic } from './../../redux/action/UserAction';

const UploadPhoto = ({ socket , user}) => {
  const dispatch = useDispatch()
  const { loadingUpdate } = useSelector(state => state.users)
  const [show, setShow] = useState(false)
  const [showPic, setShowPic] = useState(null)

  const onChange = async (event) => {
      let reader = new FileReader();
      reader.onload = () => {};
        reader.readAsDataURL(event.target.files[0]);
        setShow(true)
        const form = new FormData();
        form.append("photo", event.target.files[0]);
        dispatch(updateProfilePic(user._id , form , socket))
      };

      useEffect(() => {
        if(user?.profilePicture?.url === null) {
          setShowPic('https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true')
        } else {
          setShowPic(user?.profilePicture?.url)
          setShow(true)
        }
      },[user?.profilePicture])

      const deletePhoto = () => {
        dispatch(deleteProfilePic(user?._id , socket))
      }

  return (
    <Box>
        {
          show &&
          <Box sx={{textAlign: 'center', marginRight: '11rem'}}>
        <Tooltip title="Remove" placement='right' arrow>
          <IconButton onClick={() => { setShow(!show);deletePhoto() }} variant="contained" color="error">
            <DeleteIcon/>
          </IconButton>
        </Tooltip>
          </Box>
        }
        <Box id="uploadPicture" component="label">
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={(e) => onChange(e)}
          />
          <Box component="span" id="spanBack">
            <Box component="span">
              {
                loadingUpdate ? <CircularProgress sx={{ color : '#FFFFFF' }} style={{ width: "8rem", height: "8rem"}}/> :
                <img
                style={{
                  opacity: "1",
                  transition: "opacity 0.3s ease 0s",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                alt="avatar"
                src={showPic}
                />
              }
              
            </Box>
          </Box>
          <Box id="upIMG" sx={{ opacity : loadingUpdate ? '1' : '0' }} component="div">
            {
              !loadingUpdate ?
              <>
              <AddAPhotoIcon />
            <Typography variant="span">Upload Photo</Typography>
              </> :
              <CircularProgress sx={{ color : '#FFFFFF' }} style={{ width: "1.5rem", height: "1.5rem" , margin : '0.5rem'}}/>
            }
          </Box>
        </Box>

    </Box>
  )
}

export default UploadPhoto