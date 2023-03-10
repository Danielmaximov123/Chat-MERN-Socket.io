import React, { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";
const pdfIcon = 'https://cdn-icons-png.flaticon.com/512/136/136522.png'
const docIcon = 'https://cdn-icons-png.flaticon.com/512/136/136521.png'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const PreviewFile = ({ file, setFile }) => {
  const [previewUrl, setPreviewUrl] = useState("");
  const isDocument =
    file?.type.includes("application/msword") ||
    file?.type.includes(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    const isPDF = file.type.includes("application/pdf");
  const isImage = file.type.includes("image");
  const isVideo = file.type.includes('video')
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
    } 
  }, [file]);

  const bytesToMegaBytes = (bytes) => {
    const megaBytes = bytes / (1024 * 1024);
    if (megaBytes < 1) {
      const kiloBytes = bytes / 1024;
      return kiloBytes.toFixed(2) + ' KB';
    } else {
      return megaBytes.toFixed(2) + ' MB';
    }
  }

  useEffect(() => {
    setPageNumber(1);
  }, [file]);

  const onDocumentLoadSuccess = () => {
    setNumPages(numPages);
  };

  const handlePrevPage = () => {
    setPageNumber(prevPageNumber => prevPageNumber - 1);
  };

  const handleNextPage = () => {
    setPageNumber(prevPageNumber => prevPageNumber + 1);
  };

  return (
    <>
      <IconButton
      sx={{position: 'absolute' , color : '#FFFFFF'}}
        onClick={() => {
          setFile(!file);
          setPreviewUrl("");
        }}
      >
        X
      </IconButton>
      {isImage && (
        <img
          style={{ width: "300px", position: "relative", top: "5rem" }}
          src={previewUrl}
          alt={file.filename}
        />
      )}
      {
        isVideo && <video src={previewUrl} controls style={{ width: "300px", position: "relative", top: "7rem" }}/>
      }
      {isDocument ? <Box sx={{width: "300px" , textAlign : 'center' , position: 'relative' , top : '5rem'}} >
        <img style={{width: '20%', top: '5rem'}} src={isPDF ? pdfIcon : docIcon} alt='doc'/>
        <p>{file.name}</p>
        <span>{bytesToMegaBytes(file.size)}</span>
      </Box> : null}
      {isPDF ? <Box sx={{width: "300px" , textAlign : 'center' , position: 'relative' , top : '3rem'}} >
      <Document
            file={previewUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            >
            <Page pageNumber={pageNumber} />
          </Document>
        <p>{file.name}</p>
        <span>{bytesToMegaBytes(file.size)}</span>
      </Box> : null}
    </> 
  );
};

export default PreviewFile;
