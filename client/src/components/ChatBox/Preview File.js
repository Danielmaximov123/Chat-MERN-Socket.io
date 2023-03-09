import React, { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const PreviewFile = ({ file, setFile }) => {
  const [previewUrl, setPreviewUrl] = useState("");
  const isDocument =
    file?.type.includes("application/msword") ||
    file?.type.includes(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) ||
    file.type.includes("application/pdf");
  const isImage = file.type.includes("image");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  }, [file]);

  return (
    <Box>
      <IconButton
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
      {/* {isDocument && <DocViewer documents={[{ uri: previewUrl }]} pluginRenderers={DocViewerRenderers} />} */}
    </Box>
  );
};

export default PreviewFile;
