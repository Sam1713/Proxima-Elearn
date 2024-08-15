import React from 'react';
import { animated, useSpring } from '@react-spring/web';

const Letter: React.FC<{ letter: string; delay: number }> = ({ letter, delay }) => {
  const style = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 10,
    },
    delay: delay,
  });

  return <animated.span style={style}>{letter}</animated.span>;
};

export default Letter;
