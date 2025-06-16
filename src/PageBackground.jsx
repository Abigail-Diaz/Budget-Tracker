import styles from './PageBackground.module.css';
import { NavLink } from 'react-router-dom';

function PageBackground({ header }) {
    return (
        <>
            <div className={styles.headerBackground}>
                <h2 className={styles.header}>
                    {header}
                </h2>
            </div>
            <div className={styles.navBackground}>
                <nav className ={styles.nav}>
                    <NavLink to="/" >Dashboard</NavLink>
                    <NavLink to="/accounts" >Transactions</NavLink>
                    <NavLink to="/reports">Monthly Budget</NavLink>
                </nav>

            </div>
        </>
    );
}

export default PageBackground;