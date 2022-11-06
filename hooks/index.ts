import {useCallback, useEffect, useState} from 'react';
import {useMoralis, useWeb3Contract} from 'react-moralis';
import {BigNumber} from 'ethers';
import {abi, contractAddresses} from '../constants';
import {Listener} from '@ethersproject/abstract-provider';

export const useLotteryContractAddress = () => {
  const {chainId: chainIdHex} = useMoralis();
  const chainId = chainIdHex ? `${parseInt(chainIdHex, 16)}` as keyof typeof contractAddresses : null;
  return chainId && chainId in contractAddresses ? contractAddresses[chainId] : null;
};

export const useSubscribe = (listener: () => void | Promise<void>) => {
  const {isWeb3Enabled, web3} = useMoralis();

  useEffect(() => {
    listener();
  }, [isWeb3Enabled]);

  useEffect(() => {
    web3?.on('block', listener);

    return () => {
      web3?.off('block', listener);
    };
  }, [isWeb3Enabled, listener]);
}

export const useSubscribeToValue = <T extends any>(callback: () => T | Promise<T>, defaultValue: T | null = null) => {
  const [state, setState] = useState<T>(defaultValue as T);

  const listener = useCallback(async () => {
    const value = await callback()
    setState(value);
  }, [callback]);

  useSubscribe(listener);

  return state;
}

export const useLotteryContractBalance = () => {
  const {isWeb3Enabled, web3} = useMoralis();
  const contractAddress = useLotteryContractAddress();

  const getBalance = useCallback(async () => {
    if (isWeb3Enabled && contractAddress) {
      return web3?.getBalance(contractAddress) ?? null;
    }

    return null
  }, [isWeb3Enabled]);

  return useSubscribeToValue<BigNumber | null>(getBalance);
};

export const useLottery = <T extends string>(name: T, value?: string) => {
  const contractAddress = useLotteryContractAddress();

  const {runContractFunction, ...rest} = useWeb3Contract({
    abi,
    contractAddress: contractAddress ?? undefined,
    functionName: name,
    msgValue: value,
  });

  return {
    [name]: runContractFunction,
    ...rest,
  } as Omit<ReturnType<typeof useWeb3Contract>, 'runContractFunction'>
    & Record<T, typeof runContractFunction>;
};
