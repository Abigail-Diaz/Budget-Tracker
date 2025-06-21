import React from 'react';
import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <p>
                <a
                    href="https://icons8.com/icon/9731/doctors-bag"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Health icon
                </a>
                ,&nbsp;
                <a
                    href="https://icons8.com/icon/DC2bg4NDaqPN/dining"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Dining icon
                </a>
                , &nbsp;
                <a
                    href="https://icons8.com/icon/37982/popcorn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Entertainment icon
                </a>
                , &nbsp;
                <a
                    href="https://icons8.com/icon/33945/view-more"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Other icon
                </a>
                , &nbsp;
                <a
                    href="https://icons8.com/icon/59827/tools"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Utility icon
                </a>
                , &nbsp;
                <a
                    href="https://icons8.com/icon/9352/airplane-take-off"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Airplane icon
                </a>
                , &nbsp;
                <a
                    href="https://icons8.com/icon/sH7mI1TpXI0V/groceries"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Grocery icon
                </a>
                and&nbsp;
                <a
                    href="https://icons8.com/icon/59997/shopping-cart"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Shopping Cart icon
                </a>{' '}
                by{' '}
                <a
                    href="https://icons8.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Icons8
                </a>
            </p>
        </footer>
    );
}

export default Footer;
