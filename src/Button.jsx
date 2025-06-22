import styles from './Button.module.css';
import { useNavigate } from 'react-router-dom';


function Button({children, path}){
    const navigate = useNavigate();

    return(
       <div className={styles.buttonContainer}>
        <button onClick={() => navigate(path)} className={styles.editButton}>
          {children}
        </button>
      </div>
    )
}

export default Button;