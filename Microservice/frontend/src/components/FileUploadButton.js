// FileUploadButton.js

import { Button } from "@chakra-ui/react";
import { useRef } from "react";

const FileUploadButton = ({ onFileUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current.click(); // Trigger file input click event
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file); // Call parent component function with selected file
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Button onClick={handleFileSelect} mt={3}>
        Upload File
      </Button>
    </>
  );
};

export default FileUploadButton;
