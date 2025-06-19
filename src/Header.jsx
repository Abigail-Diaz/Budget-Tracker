
import styles from './Header.module.css';

function Header({header}){
    return(
        <div className={styles.headerBackground}>
                <h2 className={styles.header}>
                    {header}
                </h2>
            </div>
    )
}
export default Header;