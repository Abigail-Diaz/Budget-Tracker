import styles from './Navigation.module.css';
import { NavLink } from 'react-router-dom';
function Navigation({setHeader}) {
    return (<div className={styles.navBackground}>
        <nav className={styles.nav}>
            <NavLink to="/" onClick={() => setHeader('Dashboard')} >Dashboard</NavLink>
            <NavLink to="/transactions" onClick={() => setHeader('Transactions')}>Transactions</NavLink>
            <NavLink to="/budget" onClick={() => setHeader('Monthly Budget')}>Monthly Budget</NavLink>
        </nav>
    </div>)
}

export default Navigation;