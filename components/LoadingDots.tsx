import React, {useEffect, useState} from 'react';

const LoadingDots = () => {
  const [amount, setAmount] = useState<number>(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAmount(prevAmount => prevAmount === 3 ? 1 : prevAmount + 1)
    }, 300);

    return () => {
      clearInterval(intervalId);
    }
  }, []);

  return <span>{[...new Array(amount)].map(() => '.').join('')}</span>
};

export default LoadingDots;
