'use client';
import Link from 'next/link'
import { useState} from 'react';
import styles from "./Navbar.module.css";

function Navbar() {
    const [activeTab, setActiveTab] = useState("home");
    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/traffic-logs', label: 'Traffic Logs' },
        { href: '/geo-map', label: 'Geo Map' },
        { href: '/analytics', label: 'Analytics' },
        { href: '/help', label: 'Help' }
    ]

    return (
        <header>
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link href="/">Firewall</Link>
            </div>
            {navItems.map((item) =>(
                <Link   
                    key={item.href}
                    href={item.href}
                    onClick={()=> setActiveTab(item.label)}
                    className={`${styles.link} ${activeTab === item.label ? styles.active : ""}`}>
                        {item.label}
                </Link>
            ))}
        </nav>
        </header>
    );
}

export default Navbar;
