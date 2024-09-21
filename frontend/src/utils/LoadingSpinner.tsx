import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const LoadingSpinner = () => {
  const textAnimation = {
    opacity: [1, 0.5, 1], 
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity, 
    },
  };

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.loadingText}
        animate={textAnimation}
      >
        Loading...{         <CountUp start={0} end={100} duration={5} enableScrollSpy={true} scrollSpyOnce={true}/>
      }
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'black', // Amazing gradient background
    color: '#fff',
  },
  loadingText: {
    padding: '15px 30px',
    fontSize: '24px',
    color: '#fff',
    borderRadius: '10px',
    textAlign: 'center',
    fontFamily:'font-protest',
    fontWeight:'bold'
  },
};


export default LoadingSpinner;
