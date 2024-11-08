import React from 'react';
import Slideshow from './Slideshow';
import InicioContenido from './InicioContenido'

import img1 from './img/slider1.png';
import img2 from './img/slider2.png';
import img3 from './img/slider3.png';



function Inicio() {
  const images = [img1, img2, img3];

  return (
    <div className="App">
      
      <Slideshow images={images} />
      <InicioContenido />

      
    </div>
  );
}

export default Inicio;