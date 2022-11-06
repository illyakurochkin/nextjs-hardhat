import React, {useEffect} from 'react';
import {useMoralis} from 'react-moralis';
import styles from './Header.module.css';
import {showAddress} from '../utils';

const Header = () => {
  const {enableWeb3, Moralis, isWeb3Enabled, deactivateWeb3, account, isWeb3EnableLoading} = useMoralis();

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log('account changed to ', account);

      if (!account) {
        window.localStorage.removeItem('connected');
         deactivateWeb3();
      }
    });
  }, []);

  useEffect(() => {
    if (isWeb3Enabled) return;

    if (window.localStorage.getItem('connected')) {
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  const handleConnect = async () => {
    if(!isWeb3Enabled) {
      await enableWeb3();
      window.localStorage.setItem('connected', 'inject');
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.h1}>
        <h1 className={styles.title}>Lottery</h1>
        <ul className={styles.description}>
          <li>connect to Goerli testnet</li>
          <li>get fee ETH <a href={'https://faucets.chain.link/'}>here</a></li>
        </ul>
      </div>
      {account ? (
        <div>connected to <span className={styles.address}>{showAddress(account)}</span></div>
      ) : (
        <div style={{cursor: 'pointer', border: '2px solid white', display: 'inline-block', padding: '6px 12px'}} onClick={handleConnect}>
          {isWeb3EnableLoading ? 'loading...' : 'connect'}
        </div>
      )}
    </div>
  );
};

export default Header;
