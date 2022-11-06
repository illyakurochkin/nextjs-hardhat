import React, {useEffect, useState} from 'react';
import {useMoralis} from 'react-moralis';
import {useLottery, useLotteryContractBalance, useSubscribeToValue} from '../hooks';
import styles from './LotteryEntrance.module.css';
import {BigNumber, ethers} from 'ethers';
import LoadingDots from './LoadingDots';
import {showAddress} from '../utils';

const LotteryEntrance = () => {
  const {isWeb3Enabled, account} = useMoralis();
  const {enterLottery, isLoading} = useLottery('enterLottery', ethers.utils.parseEther('0.015').toString());
  const {getEntranceFee} = useLottery('getEntranceFee');
  const {getNumberOfPlayers} = useLottery('getNumberOfPlayers');
  const {getRecentWinner} = useLottery('getRecentWinner')
  const {getLotteryState, isLoading: isLotteryStateLoading, isFetching: isLotteryStateFetching} = useLottery('getLotteryState');

  const balanceData = useLotteryContractBalance();
  const entranceFeeData = useSubscribeToValue(getEntranceFee);
  const numberOfPlayersData = useSubscribeToValue(getNumberOfPlayers);
  const lotteryStateData = useSubscribeToValue(getLotteryState);
  const recentWinnerData = useSubscribeToValue(getRecentWinner);


  const entranceFee = entranceFeeData ? +ethers.utils.formatEther(entranceFeeData as BigNumber) : 0;
  const numberOfPlayers = numberOfPlayersData ? (numberOfPlayersData as BigNumber).toNumber() : 0
  const balance = balanceData ? +ethers.utils.formatEther(balanceData) : 0;
  console.log('lotteryStateData', {lotteryStateData, isLotteryStateLoading, isLotteryStateFetching});
  const canEnter = lotteryStateData !== 1;

  useEffect(() => {
    if(isWeb3Enabled) {
      getEntranceFee();
      getNumberOfPlayers();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async (tx: any) => {
    await tx.wait(10);
  };

  const handleEnterLottery = async () => {
    await enterLottery({
      onSuccess: handleSuccess,
      onError: console.error
    });
  };

  console.log('recentWinnerData === account', recentWinnerData, account);

  if(!account) {
    return null;
  }

  return (
    <div className={styles.lotteryEntranceContainer}>
      {/*{account && <div>your account: <b style={{color: '#2ecc71'}}>{showAddress(account)}</b></div>}*/}
      <div>contract balance: <b style={{color: '#a29bfe'}}>{balance} ETH</b></div>
      <div>entrance fee: <b style={{color: '#a29bfe'}}>{entranceFee} ETH</b></div>
      <div>number of players: <b style={{color: '#74b9ff'}}>{numberOfPlayers || 'no'} {numberOfPlayers === 1 ? 'player' : 'players'}</b></div>

      {canEnter && numberOfPlayers === 0 && recentWinnerData ? (
        <div>
          {'winner: '}
          <u style={{color: recentWinnerData.toString().toLocaleLowerCase() === account ? '#2ecc71' : '#e74c3c'}}>
            {showAddress(recentWinnerData as string)}
          </u>
        </div>
      ) : <div style={{color: '#fdcb6e'}}>lottery is in progress</div>}

      {canEnter ? (
        <button
          className={styles.enterButton}
          onClick={handleEnterLottery}
          disabled={isLoading}
        >
          {isLoading ? 'loading...' : 'enter lottery'}
        </button>
      ) : <div>choosing winner<LoadingDots /></div>}
    </div>
  );
};

export default LotteryEntrance;
