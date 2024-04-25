import React from 'react';
import { Button } from '@chakra-ui/react';

const DownloadFile = ({ filename }) => {
  const fileUrl = `http://localhost:5000/downloads/${filename}`;

  return (
    <Button colorScheme="blue" onClick={() => window.open(fileUrl, '_blank')}>
      Download File
    </Button>
  );
};

export default DownloadFile;
