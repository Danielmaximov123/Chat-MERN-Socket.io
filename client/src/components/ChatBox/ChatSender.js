import { Box, IconButton, TextField } from '@mui/material'
import {  useEffect, useRef, useState } from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import TelegramIcon from '@mui/icons-material/Telegram'
import { postMessages } from '../../redux/action/MessagesAction'
import { useDispatch, useSelector } from 'react-redux';
import { postNotifications } from '../../redux/action/NotificationsAction';
import InsertEmoticon from '@mui/icons-material/InsertEmoticon';
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import PreviewFile from './Preview File';
import { debounce } from 'lodash';

const ChatSenderComp = ({currentUser , chat  , socket}) => {
  const dispatch = useDispatch()
  const pickerRef = useRef(null);
  const [rows, setRows] = useState(0)
  const [newMessage, setNewMessage] = useState('')
  const [file, setFile] = useState(null)
  const {users} = useSelector((state) => state.users)  
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);

  const handleSubmit = async  (e) => {
    e.preventDefault()
    console.log();
    if(!newMessage && file === null) {
      return null
    }
    const message = {
        senderId : currentUser,
        text : newMessage.split("\n").filter(line => line.trim() !== "").join("\n"),
        chatId : chat._id,
    }
    // formData for server side
    const form = new FormData()
    form.append('file' , file)
    form.append('message' , JSON.stringify(message))
    // send message to DB 

    try {
      const receiverId = chat.members.find(id => id !== currentUser)
      let data = await dispatch(postMessages(form))
      let dataNotification = await dispatch(postNotifications({senderId : data.senderId , chatId : chat._id , date : data.createdAt}))
      let findUser = users.find(user=> user._id === data.senderId)
      socket.emit('send-message', {receiverId , data , findUser , dataNotification})
        setNewMessage('')
        setFile(null)
        setRows(0)
    } catch (error) {
        console.error(error)
    }
  }

  const handleFile = (file) => {
    if (file) {
      setFile(file);
    }
  }

  const onEmojiClick = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((el) => codeArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codeArray);
  
    const textField = document.getElementById("my-text-field");
    const start = textField.selectionStart;
    const end = textField.selectionEnd;
    const value = newMessage;
  
    // store the current cursor position
    const prevCursorPosition = textField.selectionEnd;
  
    // append the emoji to the current message at the cursor position
    const newValue = value.slice(0, start) + emoji + value.slice(end);
    setNewMessage(newValue);
  
    // restore the previous cursor position
    setTimeout(() => {
      textField.setSelectionRange(prevCursorPosition, prevCursorPosition);
    }, 0);
  };
  
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        if (!event.target.closest("#emoji-button")) {
          setShowEmojiPicker(false);
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [pickerRef]);

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // prevent default behavior of adding a new line
      const messageLines = (newMessage + "\n").split("\n");
      if (!event.shiftKey) {
        // submit the form if the user presses Enter without holding down Shift
        return handleSubmit(event);
      }
        setNewMessage(newMessage + "\n"); // append a newline character to the current value
        setRows(Math.min(messageLines.length + 1, 4)); // Update rows based on new message length
    }
  };

  const sendTypingStatus = debounce((data) => {
    socket.emit('user-typing', data);
  }, 1000);
  
  const handleInput = (event) => {
    clearTimeout(typingTimer);
    if (event.target.tagName.toLowerCase() === "input" && event.target.type === "file") {
      return;
    }
    const { value } = event.target;
    const lines = value.split('\n').length
    const newRows =lines <= 4 ? lines : 4;
    if (newRows <= 4) {
      setRows(newRows); // Update rows based on new input length
    }
    setNewMessage(value);
    if (value) {
      sendTypingStatus({ chatId : chat._id , senderId : currentUser})
      // set a timer to clear the typing status after 1 second of inactivity
      setTypingTimer(setTimeout(() => {
        sendTypingStatus(null);
      }, 250));
    } else {
      sendTypingStatus(null);
    }
  };

  return(
    <Box sx={{ position: 'relative' }}>
  <Box id='preview' sx={{ position: 'absolute' , display : 'flex' , alignItems: 'end' , bottom: '100%', left: '50%', transform: 'translateX(-50%)' }}>
    {file && <Box className="preview-pic">
      <PreviewFile file={file} setFile={setFile} />
      </Box>}
    {showEmojiPicker && <Box ref={pickerRef}> 
        <Picker previewPosition="none" theme="light" navPosition="bottom" data={data} onEmojiSelect={onEmojiClick}/> </Box>}
  </Box>
  <Box component='form' onSubmit={handleSubmit} sx={{ padding: '0rem 1rem', display: 'flex' }}>
      <TextField
      id='my-text-field'
      placeholder='Type a message...'
      sx={{ margin: '1.5rem 1rem 0.8rem 0rem', '& .MuiInputBase-root': { borderRadius: '1.3125rem' } }}
      value={newMessage}
      fullWidth
      multiline
      rows={Math.min(rows, 4)}
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      InputProps={{
        endAdornment: (
          <>
            <IconButton id="emoji-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <InsertEmoticon />
            </IconButton>
            <IconButton component="label" sx={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}>
              <input hidden type="file" onChange={e => handleFile(e.target.files[0])} accept=".doc,.docx,.pdf,.jpg,.jpeg,.png,.mp4" />
              <AttachFileIcon />
            </IconButton>
            <IconButton sx={{ backgroundColor: '#07ae12ce', transition: '0s', '&:hover': { backgroundColor: '#04870dce' } }} type='submit'>
              <TelegramIcon sx={{ color: '#FFFFFF' }} />
            </IconButton>
          </>
        ),
        onDrop: (e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0])
        },
        onDragOver: (e) => {
          e.preventDefault();
        },
      }}
    />
</Box> 
</Box> 
  )
}

export default ChatSenderComp
