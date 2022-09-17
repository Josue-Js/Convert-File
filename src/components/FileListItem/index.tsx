import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { IFile } from '../../pages';
import styles from './styles.module.scss';


type Props = {
  item: IFile;
  updateConvertFiles: (file: IFile) => void;
  onDeleteFile: (id: string) => void;
}


export function FileListItem({ item, updateConvertFiles, onDeleteFile }: Props) {

  const ref = useRef<HTMLSelectElement>(null);
  const [optionsFormatToConvert, setOptionsFormatToConvert] = useState<string[]>([]);



  useEffect(() => {
    (async () => {
      const fileType = new RegExp(/\.\w+$/gi).exec(item.file.name)![0].replace('.', '')

      const { data } = await axios.get(`https://api.cloudconvert.com/v2/convert/formats?filter[input_format]=${fileType}&include=options`);

      const formats = data.data.map(format => format.output_format);
      setOptionsFormatToConvert(formats)
    })()
  }, []);


  function handleChange() {
    const formatSelected = ref.current!.value;
    updateConvertFiles({ ...item, output_format: formatSelected });
  }


  const colorType = item.status === 'processing' ? styles.waiting : styles.finished



  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Image
          src='/file.svg'
          width={24}
          height={24}
          alt="icon file"
        />
        <span className={styles.name}>
          {item.file.name}
        </span>
      </div>

      <div className={styles.selectFormat}>
        <span>Convert to</span>

        {/* {!optionsFormatToConvert.length
          ? <span className={styles.formatInvalid}>format not supported</span>
          : ( */}
            <select
              ref={ref}
              onChange={handleChange}
              defaultValue="select"
              disabled={!!item.url}
            >
              <option hidden> select</option>
              {optionsFormatToConvert.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>  
          {/* )} */}

      </div>

      <div>
        {item.status && (
          <span className={`${styles.status} ${colorType}`}>
            {item.status}
          </span>
        )}
        {item.url && (
          <button className={styles.download}>
            <a href={item.url} download>
              <Image
                src='/download.svg'
                width={24}
                height={24}
                alt="icon download"
              />
              <span>Download</span>
            </a>
          </button>
        )}
      </div>

      <button
        className={styles.close}
        onClick={() => onDeleteFile(item.id)}
        title="delete"
      >
        <Image
          src='/close.svg'
          width={24}
          height={24}
          alt="icon delete"
        />
      </button>
    </div >
  );
}