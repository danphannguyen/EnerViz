import { Application } from '@splinetool/runtime';

const canvas = document.getElementById('canvas3d');
const app = new Application(canvas);

app.load('https://prod.spline.design/7ro9L-eFB8YM5Ktn/scene.splinecode')
  .then(() => {
    const nuc = app.findObjectByName('Nucleaire');
    const barage = app.findObjectByName('Barage');
    const cam1 = app.findObjectByName('CamBase');

    console.log(nuc);
    console.log(barage);
    console.log(cam1);
    for (const AllObjects of app.getAllObjects()) {
      // console.log(AllObjects.name);
      console.log(AllObjects);
    }
  })

  .catch(error => {
    console.error("Une erreur s'est produite lors du chargement de la scène:", error);
  });

app.addEventListener('mouseDown', (e) => {
   if (e.target.name === 'Nucleaire') {
      console.log('Nucleaire found');
  }
});

