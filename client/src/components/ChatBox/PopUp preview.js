import { Box, Dialog, DialogContent, IconButton, Slide } from "@mui/material";
import { forwardRef, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Worker } from "@react-pdf-viewer/core";
import SaveAltIcon from '@mui/icons-material/SaveAlt';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PopUpPreview = ({ file , isPDF , isImage , isVideo , messageId , setClickMessage , clickMessage , handleDownloadClick }) => {

  let pdfStyle = {
    height: "800px",
    backgroundColor: "#e4e4e4",
    overflowY: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  useEffect(() => {
    if(clickMessage === messageId) {
      if(!isImage && !isPDF && !isVideo) {
          handleDownloadClick(file);
          setClickMessage(null)
      }
    }
  },[clickMessage])

  return (
    <Dialog
      open={clickMessage === messageId && (isImage || isPDF || isVideo) ? true : false}
      fullWidth={true}
        maxWidth={'xl'}
        TransitionComponent={Transition}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{
        textAlign: "center",
        maxWidth: "100%",
        margin: "auto",
      }}
      onBackdropClick={() => setClickMessage(null)}
    >
      <Box
        style={{
          padding: "0.5rem",
          paddingRight: '3rem',
          backgroundColor: "rgb(228, 228, 228)",
          textAlign: "right",
        }}
      >
        <IconButton size="large" color="success" onClick={() => handleDownloadClick(file)}>
          <SaveAltIcon sx={{fontSize : '2rem'}}/>
        </IconButton>
        <IconButton size="large" color="error" onClick={() => setClickMessage(null)}>
          <CloseIcon sx={{fontSize : '2rem'}}/>
        </IconButton>
      </Box>
      <DialogContent style={pdfStyle}>
        {file?.url && (
            <>
            {
                isPDF && 
              <Worker workerUrl={"https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"}>
                <Viewer
                  defaultScale={SpecialZoomLevel.PageWidth}
                  fileUrl={file?.url}
                  />
              </Worker>
            }
            {
              isImage &&
                <img
              src={file.url}
              alt={file.filename}
              className="preview-image-video"
              style={{width : '60%'}}
            />
            }
            {
              isVideo &&
              <video src={file?.url} width="60%" className="preview-image-video" autoPlay controls/>
            }
            </>
            )}
      </DialogContent>
    </Dialog>
  );
};

export default PopUpPreview;
