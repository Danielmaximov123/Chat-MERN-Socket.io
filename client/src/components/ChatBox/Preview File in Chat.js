import { Box, Button, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { pdfjs, Document, Page } from "react-pdf";
import { Link } from "react-router-dom";
const docIcon = "https://cdn-icons-png.flaticon.com/512/136/136521.png";
const pdfIcon = 'https://cdn-icons-png.flaticon.com/512/136/136522.png'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PreviewFileInChat = ({ file}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setPageNumber(1);
  }, [file]);

  const onDocumentLoadSuccess = () => {
    setLoading(true)
    setNumPages(numPages);
    setLoading(false)
  };

  let button = {
    color: "#07ae12ce",
    borderColor: "#07ae12ce",
    width: "48%",
    "&:hover": { borderColor: "#07ae12ce" },
  };

  return (
    <>
      {file.type?.includes("image") && (
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
      {file.type?.includes("pdf") && (
        <Box>
          {loading ? <Box
          sx={{
            width: "300px",
            textAlign: "center",
            position: "relative",
            top: "5rem",
          }}
        >
          <img
            style={{ width: "20%", top: "5rem" }}
            src={docIcon}
            alt="doc"
          />
          <p>{file.name}</p>
          <span>{file?.size}</span>
        </Box> :
          <Document file={file.url} onLoadSuccess={onDocumentLoadSuccess}>
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
        }
          <Divider sx={{ margin: "0.5rem 0rem" }} />
          <Box sx={{ textAlign: "center" }}>
            <Button
              component={Link}
              href={file.url}
              target='_blank'
              download={file.filename}
              sx={{ ...button, marginRight: "0.3rem" }}
              variant="outlined"
            >
              Save as...
            </Button>
            <Button sx={{ ...button, marginLeft: "0.3rem" }} variant="outlined">
              Open
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default PreviewFileInChat;
