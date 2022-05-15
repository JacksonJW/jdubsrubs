import Link from 'next/link'

import { FaShoppingCart } from 'react-icons/fa';

import { useCart } from '../../hooks/use-cart.js';

import styles from './Nav.module.css';

const Nav = () => {
    const { subtotal, checkout } = useCart();
    return (
        <nav className={styles.nav}>
            <p className={styles.navTitle}>
                <Link href="/">
                    J Dub&apos;s Rubs
                </Link>
            </p>
            <p className={styles.navCart}>
                <Link href="/cart">
                    <a><FaShoppingCart /> ${subtotal}</a>
                </Link>
            </p>
        </nav>
    )
}

export default Nav;