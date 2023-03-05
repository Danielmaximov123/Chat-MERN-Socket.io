import { Box, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material';
import { useState ,useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useDispatch, useSelector } from 'react-redux';
import { updateProfilePic } from '../../redux/action/UserAction';
import { deleteProfilePic } from '../../redux/action/UserAction';

const UploadPhotoRegister = ({ setProfilePic , profilePic}) => {
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [showPic, setShowPic] = useState(null)
  const [selectedPic, setSelectedPic] = useState(null)

  const onChange = async (event) => {
      let reader = new FileReader();
      reader.onload = (e) => {
        setSelectedPic(e.target.result);
      };
        reader.readAsDataURL(event.target.files[0]);
        setShow(true)
        setProfilePic(event.target.files[0])
      };

      useEffect(() => {
        if(profilePic === null && selectedPic === null) {
          setShowPic('https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true')
        } else if(selectedPic !== null) {
          setShowPic(selectedPic)
          setShow(true)
        }
      },[profilePic , selectedPic])

      const deletePhoto = () => {
        setProfilePic(null);
        setShowPic('https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true')
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
            </Box>
          </Box>
          <Box id="upIMG"component="div">
              <AddAPhotoIcon />
            <Typography variant="span">Upload Photo</Typography>
          </Box>
        </Box>

    </Box>
  )
}

export default UploadPhotoRegister