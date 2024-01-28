import React from 'react';

type Props = {
  onFileUpload: (file: File) => void;
};

const FileUpload: React.FC<Props> = ({ onFileUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return <input type="file" onChange={handleFileChange} />;
};

export default FileUpload;
