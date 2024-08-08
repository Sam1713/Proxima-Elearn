import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface FileModalTypes {
  isOpenFile: boolean;
  onCloseFile: () => void;
}

const FileModal: React.FC<FileModalTypes> = ({ isOpenFile, onCloseFile }) => {
  const singleTutor = useSelector((state: RootState) => state.admin.singleTutor);

  if (!isOpenFile) return null;

  return (
    <div className='inset-0 fixed bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white w-[70%] h-[90vh] rounded-xl shadow-lg overflow-y-auto relative'>
      <button
          onClick={onCloseFile}
          className='md:mr-56 md:top-2  md:right-0  fixed text-black text-4xl rounded-full p-4'
        >
          &times;
        </button>
        <div className='p-6'>
          {singleTutor && singleTutor.files.length > 0 ? (
            singleTutor.files.map((file: string, index: number) => {
              if (!file) {
                return (
                  <div key={index} className='p-4 bg-gray-100 rounded-xl mb-4 shadow-md'>
                    <p className='text-red-500'>Invalid file format</p>
                  </div>
                );
              }

              const isImage = /\.(jpeg|jpg|gif|png)$/.test(file);
              const isPDF = /\.pdf$/.test(file);

              return (
                <div key={index} className='p-4 object-contain bg-gray-100 rounded-xl mb-4 shadow-md'>
                  {isImage && (
                    <img
                      src={file}
                      alt={file}
                      className=' w-[100%] object-contain h-auto rounded-lg'
                    />
                  )}
                  {isPDF && (
                    <iframe
                      src={file}
                      className='w-full h-[500px] rounded-lg'
                      title={`PDF-${index}`}
                      onError={(e) => {
                        (e.target as HTMLIFrameElement).style.display = 'none';
                        (e.target.nextSibling as HTMLElement).style.display = 'block';
                      }}
                    ></iframe>
                  )}
                  {!isImage && !isPDF && (
                    <p className='text-red-500'>Unsupported file format</p>
                  )}
                  {isPDF && (
                    <p className='hidden text-red-500'>We can't open this file. Something went wrong.</p>
                  )}
                </div>
              );
            })
          ) : (
            <p className='text-gray-700'>No files available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileModal;
