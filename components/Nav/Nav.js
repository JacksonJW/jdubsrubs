import { FaShoppingCart } from 'react-icons/fa';

import { useCart } from '../../hooks/use-cart.js';

import styles from './Nav.module.css';

const Nav = () => {
    const { subtotal, checkout } = useCart();
    return (
        <nav className={styles.nav}>
            <p className={styles.navTitle}>
                J Dub's Rubs
            </p>
            <p className={styles.navCart}>
                <button onClick={checkout}>
                    <FaShoppingCart /> ${subtotal}
                </button>
            </p>
        </nav>
    )
}

export default Nav;