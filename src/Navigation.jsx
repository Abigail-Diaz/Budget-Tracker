import styles from './Navigation.module.css';
import { NavLink } from 'react-router-dom';
function Navigation() {
    return (<div className={styles.navBackground}>
        <nav className={styles.nav}>
            <NavLink to="/" >Dashboard</NavLink>
            <NavLink to="/accounts" >Transactions</NavLink>
            <NavLink to="/reports">Monthly Budget</NavLink>
        </nav>
    </div>)
}

export default Navigation;