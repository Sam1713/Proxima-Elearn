import React from 'react';
import Letter from '../animation/UseLetterAnimation'; // Adjust path as needed

const AnimatedText: React.FC<{ text: string }> = ({ text }) => {
  console.log('text',text)
  return (
    <div className='font-bold'>
      
      {text.split('').map((letter, index) => (
        <Letter key={index} letter={letter} delay={index * 50} />
      ))}
    </div>
  );
};

export default AnimatedText;
