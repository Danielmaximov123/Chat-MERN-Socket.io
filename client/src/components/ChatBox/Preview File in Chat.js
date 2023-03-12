import {
  Avatar,
  Box,
  Button,
  Divider,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { pdfjs, Document, Page } from "react-pdf";
const docIcon = "https://cdn-icons-png.flaticon.com/512/2932/2932891.png";
const pdfIcon = "https://cdn-icons-png.flaticon.com/512/2932/2932728.png";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PreviewFileInChat = ({ file , myUser}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setNumPages(numPages);
    setLoading(false);
  };

  let button = {
    color: myUser ? "#07ae12ce" : '#696969ab',
    borderColor: myUser ? "#07ae12ce" : '#696969ab',
    width: "48%",
    "&:hover": { borderColor: myUser ? "#07ae12ce" : '#696969ab' },
  };

  return (
    <>
      {isImage && (
        <PhotoProvider maskOpacity={0.5}>
          <PhotoView src={file.url} zIndex={999}>
            <img
              src={file.url}
              alt={file.filename}
              style={{ cursor: "pointer" }}
              width="150px"
            />
          </PhotoView>
        </PhotoProvider>
      )}
      {isPDF || isDocument ? (
        <Box>
            {
              isPDF ?
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
            </Document> : null
            }
          <ListItem sx={{ paddingLeft: "0.1rem" }}>
            <ListItemAvatar>
              <Avatar
                alt={isPDF ? pdfIcon : docIcon}
                src={isPDF ? pdfIcon : docIcon}
              />
            </ListItemAvatar>
            <ListItemText primary={<Typography style={{ fontSize : '0.75rem' , fontWeight : '300' }}>{file.originalname}</Typography>} secondary={<Typography style={{ fontSize : '0.68rem' , fontWeight : '300' }}>{file.size}</Typography>} />
          </ListItem>
          <Divider sx={{ margin: "0.5rem 0rem" }} />
          <Box sx={{ textAlign: "center" }}>
            <Button
              component={Link}
              href={file.url}
              target="_blank"
              download={file.filename}
              sx={{ ...button, marginRight: "0.3rem" }}
              variant="outlined"
            >
              Save as...
            </Button>
            <Button
              component={Link}
              href={file.url}
              target="_blank"
              sx={{ ...button, marginLeft: "0.3rem" }}
              variant="outlined"
            >
              Open
            </Button>
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default PreviewFileInChat;
