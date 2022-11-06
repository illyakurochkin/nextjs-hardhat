import React from 'react';
import {ConnectButton} from 'web3uikit';
import styles from './Header.module.css';


const Header = () => {
  return (
    <div className={styles.header}>
      <ConnectButton moralisAuth={false} />
    </div>
  );
};

export default Header;
