import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { IFile } from '../../pages';
import { FileListItem } from '../FileListItem';

import styles from './styles.module.scss';

type Props = {
  convertFiles: IFile[];
  onConvert: () => void;
  onAddFile: (file: File) => void;
  updateConvertFiles: (file: IFile) => void;
  onDeleteFile: (id: string) => void;
}



export function ConvertFile({ convertFiles, onConvert, onAddFile, updateConvertFiles, onDeleteFile }: Props) {

  const ref = useRef<HTMLInputElement>(null);
  const [isConvert, setIsConvert] = useState(false)



  useEffect(() => {
    const items = convertFiles.filter(item => item.status === 'processing');
    if (items.length) {
      setIsConvert(true);
    } else {
      setIsConvert(false);
    }
  }, [convertFiles])


  function handleChange() {
    if (ref.current) {
      const file = ref.current.files
      if (file) {
        onAddFile(file[0]);
      }
    }
  }

  function handleConvert() {
    onConvert();
    setIsConvert(false)
  }



  return (
    <div className={styles.container}>
      <main>
        {convertFiles.map(data => (
          <FileListItem
            key={data.id}
            item={data}
            updateConvertFiles={updateConvertFiles}
            onDeleteFile={onDeleteFile}
          />
        ))}
      </main>

      <footer>
        <label htmlFor='file' className={styles.buttonAddFile} >
          <Image src='/addFile.svg' width={24} height={24} alt="icon add file" />
          <span>
            Add more file
          </span>
        </label>
        <input
          ref={ref}
          id='file'
          type='file'
          onChange={handleChange}
        />

        <button
          className={styles.buttonConvert}
          onClick={handleConvert}
          disabled={isConvert}
        >
          <span>
            <Image src='/convert.svg' width={24} height={24} alt="icon convert" />
          </span>
          Convert
        </button>
      </footer>
    </div>
  );
}