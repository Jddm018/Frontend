import React, { useState, useEffect } from 'react';
import './Slideshow.css';

const Slideshow = ({ images }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 3000); // Cambiar la imagen cada 3 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  const prevSlide = () => {
    setIndex(index === 0 ? images.length - 1 : index - 1);
  };

  const nextSlide = () => {
    setIndex(index === images.length - 1 ? 0 : index + 1);
  };

  return (
    <div className="slideshow">
      <button className="prev" onClick={prevSlide}>&#10094;</button>
      {images.map((image, i) => (
        <div key={i} className={i === index ? 'slide active' : 'slide'}>
          <img src={image} alt={`Slide ${i}`} />
        </div>
      ))}
      <button className="next" onClick={nextSlide}>&#10095;</button>
    </div>
  );
};

export default Slideshow;
