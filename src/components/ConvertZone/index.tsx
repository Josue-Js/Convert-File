import { SiConvertio } from 'react-icons/si';
import { AiFillFileAdd } from 'react-icons/ai';



import { ListFIle } from '../ListFile/index';
import styles from './styles.module.scss';



export function ConvertZone() {


  return (
    <div className={styles.convertZone}>
      <main>
        <ListFIle />
      </main>


      <footer>
        <button type='button' className={styles.addMoreFile}>
          <AiFillFileAdd size={24} color="#131313"/>
          add more file
        </button>
        <button type='button' className={styles.convert}>
          <SiConvertio size={24} color="#fff"/>
            convert
        </button>
      </footer>
    </div>
  );
}