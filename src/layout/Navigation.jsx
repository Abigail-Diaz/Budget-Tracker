import styles from "./Navigation.module.css";
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <div className={styles.navBackground}>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Expenses
        </NavLink>
        <NavLink
          to="/budget"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Monthly Budget
        </NavLink>
      </nav>
    </div>
  );
}

export default Navigation;
