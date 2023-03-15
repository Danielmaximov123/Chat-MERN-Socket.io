import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Grid,
  ListItemText,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getUser } from "../../redux/action/UserAction";
import { StyledBadge } from "../Custom Style/StyledAvatarDot";
import { getMessages } from "./../../redux/action/MessagesAction";
import ChatSenderComp from "./ChatSender";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import PreviewFileInChat from "./Preview File in Chat";

const ChatBoxComp = ({ chat, currentUser, online, socket }) => {
  const [userData, setUserData] = useState(null);
  const scroll = useRef();
  const scrollLoadMore = useRef();
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => ({
    messages: state.messages.messages,
    loading: state.messages.loading,
  }));
  const [limit, setLimit] = useState(10);
  const [isTyping, setIsTyping] = useState(null);
  const [clickMessage, setClickMessage] = useState(null)

  const loadMoreMessages = useCallback(() => {
    if (
      scrollLoadMore.current &&
      scrollLoadMore.current.scrollTop <= 0 &&
      limit < messages.length
    ) {
      setLimit((prevLimit) => prevLimit + 4);
    }
  }, [messages.length, limit]);

  useEffect(() => {
    if (scrollLoadMore.current) {
      scrollLoadMore.current.addEventListener("scroll", loadMoreMessages);
      return () => {
        if (scrollLoadMore.current) {
          scrollLoadMore.current.removeEventListener(
            "scroll",
            loadMoreMessages
          );
        }
      };
    }
  }, [loadMoreMessages]);

  useEffect(() => {
    const userId = chat?.members?.find((id) => !id.includes(currentUser));
    const getUserData = async () => {
      try {
        let resp = await getUser(userId);
        setUserData(resp);
      } catch (error) {
        console.error(error);
      }
    };
    chat !== null && getUserData();
  }, [chat, currentUser, dispatch]);

  // fetch messages
  useEffect(() => {
    chat !== null && dispatch(getMessages(chat?._id));
  }, [dispatch, chat]);

  const lastMessages = useMemo(() => messages.slice(-limit), [messages, limit]);

  useEffect(() => {
    if (scroll.current) {
      setTimeout(() => {
        scroll.current.scrollIntoView({ behavior: "smooth" });
      }, 250);
    }
  }, [messages]);

  useEffect(() => {
    socket.on("typing", (type) => {
      setIsTyping(type);
    });
  }, [socket]);

  const userId = useMemo(
    () => chat?.members?.find((id) => !id.includes(currentUser)),
    [chat, currentUser]
  );

  const userIsTyping = useMemo(() => {
    if (
      isTyping &&
      isTyping.chatId === chat._id &&
      isTyping.senderId === userId
    ) {
      return true;
    } else {
      return false;
    }
  }, [isTyping, chat._id, userId]);

  return (
    <>
      {loading ? (
        <Box sx={{ margin: "auto" }}>
          <CircularProgress
            sx={{ height: "4rem", width: "4rem" }}
            color="success"
          />
        </Box>
      ) : (
        <>
          {/* Chat Header */}
          <Box>
            <Box display="inline-flex" sx={{ margin: "1rem" }}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant={online ? "dot" : "standard"}
              >
                <Avatar
                  sx={{ width: 56, height: 56 }}
                  alt={userData?.profilePicture?.url}
                  src={
                    userData?.profilePicture?.url
                      ? userData.profilePicture?.url
                      : "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true"
                  }
                />
              </StyledBadge>
              <ListItemText
                primary={<p style={{ margin: 0 }}>{userData?.displayName}</p>}
                secondary={online ? "Online" : "Offline"}
                sx={{ marginLeft: "8px" }}
              />
            </Box>
            <Divider sx={{ marginLeft: "0" }} variant="inset" />
          </Box>
          {/* Chat Box Messages */}
          <Box className="chat-body" ref={scrollLoadMore}>
            {scrollLoadMore?.current?.scrollTop === 5 && (
              <Box sx={{ margin: "auto" }}>
                <CircularProgress
                  sx={{ height: "4rem", width: "4rem" }}
                  color="success"
                />
              </Box>
            )}
            {lastMessages.length > 0 && (
              <>
                {lastMessages?.map((message, index) => {
                  return (
                    <Box
                      key={index}
                      ref={scroll}
                      className={
                        message?.file?.url !== null && "file-in-message"
                      }
                      sx={{
                        padding: "1rem",
                        alignSelf:
                          message?.senderId === currentUser
                            ? "flex-end"
                            : "flex-start",
                        display: "inline-grid",
                        border:
                          message?.senderId === currentUser
                            ? "1px #07ae12ce solid"
                            : "1px #696969ab solid",
                        color:
                          message?.senderId === currentUser
                            ? "#07ae12ce"
                            : "#696969ab",
                        borderRadius: "1rem 1rem 0rem 1rem",
                        gap: "0.5rem",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          cursor: "pointer",
                        }}
                      >
                        {Object.values(message.file).every(
                          (value) => value !== null
                        ) && (
                            <>
                           <PreviewFileInChat
                            myUser={message?.senderId === currentUser}
                            file={message.file}
                            setClickMessage={setClickMessage}
                            clickMessage={clickMessage}
                            messageId={message?._id}
                          />
                            </>
                        )}

                        {
                          message?.file.url !== null &&
                          <Box
                        className="first-box-preview"
                        onClick={() => {
                          setClickMessage(message._id)
                        }}
                        >
                          <p style={{color: '#FFFFFF', fontSize: '2.5rem'}}>{
                          ['pdf', 'image', 'video'].some(substring => message?.file?.type?.includes(substring)) ? 'Tap To open' : 'Tap to Save as'
                            }</p>
                        </Box>
                        }
                      </Box>
                      { message?.text && message?.file?.url !== null ? <Divider /> : null }
                      <Box style={{ maxHeight: "8rem", overflowY: "auto" }}>
                        <span
                          style={{
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: message?.text?.includes("\n")
                              ? "pre-wrap"
                              : "initial",
                          }}
                        >
                          {message?.text}
                        </span>
                      </Box>
                      <span style={{ fontSize: "0.7rem", alignSelf: "end" }}>
                        {moment(message?.createdAt)
                          .startOf(message?.createdAt)
                          .fromNow()}
                      </span>
                    </Box>
                  );
                })}
              </>
            )}
            {userIsTyping && (
              <Box sx={{ alignSelf: "flex-start", color: "#696969ab" }}>
                <span
                  sx={{ fontSize: "1rem" }}
                >{`${userData?.displayName} is typing...`}</span>
              </Box>
            )}
          </Box>
          {/* Chat Sender */}
          <Box>
            <ChatSenderComp
              chat={chat}
              currentUser={currentUser}
              socket={socket}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default ChatBoxComp;
