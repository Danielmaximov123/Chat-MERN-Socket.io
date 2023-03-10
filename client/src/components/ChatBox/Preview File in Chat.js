import React from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css';

const PreviewFileInChat = ({file}) => {
  return (
    <>
    {
        file.mimetype.includes('image') &&
        <PhotoProvider maskOpacity={0.5} >
          <PhotoView src={file.url} zIndex={999} >
          <img src={file.url} alt={file.filename} style={{ cursor : 'pointer' }}  width='150px' />
          </PhotoView>
        </PhotoProvider>
    }

    </>
  )
}

export default PreviewFileInChat