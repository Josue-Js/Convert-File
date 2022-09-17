import { MdInsertDriveFile, MdClose, MdDownload } from 'react-icons/md';

import styles from './styles.module.scss';



export function ListFIle() {


  return (
    <div className={styles.listFile}>
      <div className={styles.wrapper}>
        <MdInsertDriveFile size={24} color="#131313" />
        <span>photo.png</span>
      </div>

      <div className={styles.selectOutputFormat}>
        <label htmlFor='file'>convert to</label>
        <select id='file'>
          <option>jpg</option>
        </select>
      </div>


      <div className='align'>
        {/* <span className={styles.statusFile}>
          Finished
        </span>
  
        <a download='#'>
          <MdDownload size={24} color="#000"/>
          <span>Download</span>
        </a> */}
      </div>


      <button className={styles.close}>
        <MdClose size={18} color="#000" />
      </button>

    </div>
  );
}