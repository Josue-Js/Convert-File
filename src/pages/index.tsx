import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

import { ConvertFile } from '../components/ConvertFile';
import { DragZone } from '../components/DropZone';

import styles from '../styles/Home.module.scss';


export type IFile = {
  status?: 'finished' | 'processing';
  id: string;
  file: File;
  output_format?: string;
  url?: string;
}



function Home() {

  const [convertFiles, setConvertFiles] = useState<IFile[]>([]);


  function handleAddFile(file: File) {
    const newFile: IFile = {
      id: uuid(),
      file,
    }
    setConvertFiles([...convertFiles, newFile]);
  }


  function deleteFile(id: string) {
    setConvertFiles(data => data.filter(item => item.id != id));
  }


  function updateConvertFiles(data: IFile) {
    setConvertFiles(prev => {
      return prev.map(item => {
        if (data.id === item.id) {
          return data
        }
        return item
      });

    });
  }



  function handleConvertFiles() {

    convertFiles.forEach(async (item) => {
      if (!item.output_format) {
        return
      }

      if (!item.url) {
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('output_format', item.output_format);


        try {
          updateConvertFiles({
            ...item,
            status: 'processing'
          })
          const { data } = await axios.post('/api/convert', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
         
          updateConvertFiles({
            ...item,
            url: data.result.files[0].url,
            status: 'finished'
          })
          
        } catch (err: any) {
           updateConvertFiles({
            ...item,
          })
          alert(err.response.data.message)
        }
      }
    });
  }



  return (
    <div className={styles.container}>
      <div className={styles.box}>
        {!convertFiles.length
          ? <DragZone onDrop={handleAddFile} />
          : <ConvertFile
            convertFiles={convertFiles}
            onConvert={handleConvertFiles}
            onAddFile={handleAddFile}
            updateConvertFiles={updateConvertFiles}
            onDeleteFile={deleteFile}
          />
        }
      </div>
    </div>
  )
}

export default Home
