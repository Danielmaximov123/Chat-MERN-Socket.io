import React, { useState } from "react";
import { Picker } from 'emoji-mart';

const ChatSend = () => {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleFileChange = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
      };


    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");
        setFile(null);
      };

  return (
      <form onSubmit={handleSubmit}>
      <div>
        <input type="text" placeholder="Type a message..." value={message} onChange={e => setMessage(e.target.value)} />
      </div>
      <div>
        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😀</button>
        {showEmojiPicker && (
          <Picker onSelect={(e) => message + e.native} />
        )}
        <button type="submit">Send</button>
      </div>
    </form>
  );
}

export default ChatSend