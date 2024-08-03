import React from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { MdPictureAsPdf } from "react-icons/md";

const FilePreviewModal = ({ open, onClose, selectedFiles }) => {
  return (
    <Modal open={open} onClose={onClose} center>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {selectedFiles.map((file, index) => (
          file.type === "application/pdf" ? (
            <div key={index} className="w-full h-64 flex items-center justify-center bg-gray-200">
              <MdPictureAsPdf className="text-red-500 w-20 h-20" />
            </div>
          ) : (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={`Selected ${index}`}
              className="w-full h-64 object-cover"
            />
          )
        ))}
      </div>
    </Modal>
  );
};

export default FilePreviewModal;
