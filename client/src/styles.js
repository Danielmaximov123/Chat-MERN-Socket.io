exports.mainBoxInAuthPage = {
  width: '100%',
  height: '100vh',
  backgroundColor: '#edeeee',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
  zIndex: '50',
}

exports.mainBoxInChatPage = {
  width: '100%',
  height: '100vh',
  backgroundColor: '#edeeee',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  padding: '1rem',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
  zIndex: '50',
}

exports.userInConversation = {
  display: 'flex',
  alignItems: 'center',
  margin: '1rem',
  padding: '0.8rem',
    borderRadius: '1rem',
    '& :hover': {
      background: '#d9d5d5',
      padding : '0.8rem'
    },
}

exports.userInConversationBox = {
  '& :hover': {
    background: '#d9d5d5',
  },
}
