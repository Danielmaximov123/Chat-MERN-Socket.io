import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import PopUpPreview from "./PopUp preview";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
const docIcon = "https://cdn-icons-png.flaticon.com/512/2932/2932891.png";
const pdfIcon = "https://cdn-icons-png.flaticon.com/512/2932/2932728.png";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PreviewFileInChat = ({
  file,
  myUser,
  setClickMessage,
  messageId,
  clickMessage,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const isDocument =
    file?.type.includes("application/msword") ||
    file?.type.includes(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
  const isPDF = file.type.includes("application/pdf");
  const isImage = file.type.includes("image");
  const isVideo = file.type.includes("video");

  useEffect(() => {
    setPageNumber(1);
  }, [file]);

  const onDocumentLoadSuccess = () => {
    setNumPages(numPages);
  };

  const handleDownloadClick = async (file) => {
    const response = await fetch(file.url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const tempLink = document.createElement("a");
    tempLink.href = objectUrl;
    tempLink.setAttribute("download", file.originalname);
    tempLink.click();
  };

  return (
    <>
      {isImage && (
            <img
              src={file.url}
              alt={file.filename}
              style={{borderRadius: '1rem 1rem 0rem 0rem' , width : '100%'}}
            />
      )}
      {isVideo && (
        // <Plyr source={file?.url}/>
        <Box style={{ position: 'relative', width: '100%', cursor: 'pointer', borderRadius: '1rem 1rem 0rem 0rem', overflow: 'hidden' }}>
  <video src={file?.url} width="100%" />
  <Box
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1,
      color: 'white',
    }}
  >
    <PlayArrowIcon  sx={{ fontSize: '5rem' , color : '#FFFFFF' , backgroundColor : '#28ABFA' , borderRadius : '50%' }} />
  </Box>
</Box>
      )}
      {isPDF || isDocument ? (
        <Box
          sx={{ cursor: isPDF && "pointer", zIndex: "5" }}
          onClick={() => isPDF && setClickMessage(null)}
        >
          {isPDF ? (
            <Document file={file?.url} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={pageNumber}
                className="PDF-viewer-can"
                renderAnnotationLayer={false}
                renderTextLayer={false}
                textLayerProps={{
                  itemPadding: 3,
                  fontSize: 10,
                  fontColor: "#000000",
                  fontFamily: "Helvetica",
                }}
              />
            </Document>
          ) : null}
          <ListItem sx={{ paddingLeft: "0.1rem", paddingBottom: "0px" }}>
            <ListItemAvatar>
              <Avatar
                alt={isPDF ? pdfIcon : docIcon}
                src={isPDF ? pdfIcon : docIcon}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography style={{ fontSize: "0.75rem", fontWeight: "300" }}>
                  {file.originalname}
                </Typography>
              }
              secondary={
                <Typography style={{ fontSize: "0.68rem", fontWeight: "300" }}>
                  {file.size}
                </Typography>
              }
            />
          </ListItem>
        </Box>
      ) : null}
      <PopUpPreview
        file={file}
        isPDF={isPDF}
        isImage={isImage}
        isVideo={isVideo}
        clickMessage={clickMessage}
        setClickMessage={setClickMessage}
        messageId={messageId}
        handleDownloadClick={handleDownloadClick}
      />
    </>
  );
};

export default PreviewFileInChat;
