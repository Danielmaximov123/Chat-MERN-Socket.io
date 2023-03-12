const multer = require('multer')
const firebase = require('firebase/app')
const { getStorage , ref , uploadBytes , getDownloadURL , listAll , deleteObject, getBlob, getStream} = require('firebase/storage')
const iconv = require('iconv-lite');

const firebaseConfig = {
  apiKey: process.env.FirebaseApiKey,
  authDomain: process.env.FirebaseAuthDomain,
  projectId: process.env.FirebaseProjectId,
  storageBucket: process.env.FirebaseStorageBucket,
  messagingSenderId: process.env.FirebaseMessagingSenderId,
  appId: process.env.FirebaseAppId,
}


firebase.initializeApp(firebaseConfig);
const storage = getStorage();

exports.upload = multer({ storage: multer.memoryStorage() })

exports.deleteFilesFromUserFolder = async (userId) => {
    const storageRef = ref(storage , `users/${userId}`);
    const files = await listAll(storageRef);

    await Promise.all(files.items.map(async (fileRef) => {
      await deleteObject(fileRef);
      return(`File ${fileRef.name} deleted successfully.`);
    }));
    return null
  }

  exports.uploadProfilePicture = async (file , userId) => {
    await this.deleteFilesFromUserFolder(userId)
    const storageRef = ref(storage , `users/${userId}/${iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf-8')}`);
    await uploadBytes(storageRef , file.buffer)
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL
  };

  exports.uploadFileInChat = async (chatId , file , messageId) => {
    let filename = `${messageId} ${iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf-8')}`
    const storageRef = ref(storage , `messages/${chatId}/${filename}`);
    await uploadBytes(storageRef , file.buffer)
    const downloadURL = await getDownloadURL(storageRef);
    const getBlobURL = await getBlob()
    const getStream = await getStream()
    return { filename , url : downloadURL.downloadURL , urle : downloadURL.getBlobURL , urlw : downloadURL.getStream , type : file.mimetype}
  };

  exports.deleteFilesFromMessagesFolder = async (chatId , messageId) => {
    const storageRef = ref(storage , `messages/${chatId}`);
    const files = await listAll(storageRef);

    await Promise.all(files.items.map(async (fileRef) => {
      if(fileRef.name.includes(messageId)) {
        await deleteObject(fileRef);
        return(`File ${fileRef.name} deleted successfully.`);
      } else {
        return null
      }
    }));
    return null
  }



