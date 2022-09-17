import { DragEvent, useRef, useState } from 'react';
import Image from 'next/image';

import styles from './styles.module.scss';


type Props = {
  onDrop: (files: File) => void;
}


export function DragZone({ onDrop }: Props) {

  const ref = useRef<HTMLInputElement>(null);
  const [isActiveDropZone, setIsActiveDropZone] = useState(false);



  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsActiveDropZone(true);
  }

  function handleDragLeave() {
    setIsActiveDropZone(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file instanceof File) {
      onDrop(file);
    }
    setIsActiveDropZone(false)
  }

  function handleChange() {
    if (ref.current) {
      const file = ref.current.files

      if (file) {
        onDrop(file[0])
      }
    }
  }



  return (
    <div
      className={`${styles.dropZone} ${isActiveDropZone ? styles.active : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <p className={styles.a}>Drop File here</p>
      <span>or</span>
      <div className={styles.selectFile}>
        <label htmlFor="file">Choose file</label>
        <Image src='/attach_file.svg' alt='icon file' width={24} height={24} />
        <input
          ref={ref}
          type="file"
          id="file"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}