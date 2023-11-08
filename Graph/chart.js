import Bretagne from './Bretagne.json' assert { type: "json" };
import IDF from './IledeFrance.json' assert { type: "json" };
import Auvergne from './Auvergne.json' assert { type: "json" };
import Bourgogne from './Bourgogne.json' assert { type: "json" };
import Centre from './Centre.json' assert { type: "json" };
import GrandEst from './GrandEst.json' assert { type: "json" };
import HautsDeFrance from './HautsDeFrance.json' assert { type: "json" };
import Normandie from './Normandie.json' assert { type: "json" };
import NouvelleAquitaine from './NouvelleAquitaine.json' assert { type: "json" }; 
import Occitanie from './Occitanie.json' assert { type: "json" };
import PaysDeLaLoire from './PaysDeLaLoire.json' assert { type: "json" };
import PACA from './PACA.json' assert { type: "json" };



/*
* variables
*/
let GLOBAL_DATA = Bretagne;

//TypeData
let dataType = document.querySelector('.choice');

//Regions
let btnBretagne = document.getElementById('Bretagne');
let btnIDF = document.getElementById('Ile-de-France');
let btnAuvergne = document.getElementById('Auvergne');
let btnBourgogne = document.getElementById('Bourgogne');
let btnCentre = document.getElementById('Centre');
let btnGrandEst = document.getElementById('Grand-Est');
let btnHautsDeFrance = document.getElementById('Hauts-de-France');
let btnNormandie = document.getElementById('Normandie');
let btnNouvelleAquitaine = document.getElementById('Nouvelle-Aquitaine');
let btnOccitanie = document.getElementById('Occitanie');
let btnPaysDeLaLoire = document.getElementById('Pays-de-la-Loire');
let btnPACA = document.getElementById('PACA');

//Energie
let NRJ = document.querySelectorAll('.energy-filter');
let btnThermique = document.getElementById('Thermique');
let btnNucléaire = document.getElementById('Nucléaire');
let btnEolien = document.getElementById('Eolien');
let btnSolaire = document.getElementById('Solaire');
let btnHydraulique = document.getElementById('Hydraulique');
let btnBioénergies = document.getElementById('Bioénergies');

//Tableaux
let arrayBtnRegions = [btnBretagne, btnIDF, btnAuvergne, btnBourgogne, btnCentre, btnGrandEst, btnHautsDeFrance, btnNormandie, btnNouvelleAquitaine, btnOccitanie, btnPaysDeLaLoire, btnPACA];

let arrayBtnNRJ = [btnThermique, btnNucléaire, btnEolien, btnSolaire, btnHydraulique, btnBioénergies];

let arrayData = [Bretagne, IDF, Auvergne, Bourgogne, Centre, GrandEst, HautsDeFrance, Normandie, NouvelleAquitaine, Occitanie, PaysDeLaLoire, PACA];

//création de 2 tableaux pour cibler les éléments que je souhaite de data
let conso = []; 
let prod =  [];

let isProd = true;

//création de 7 tableaux pour cibler les éléments que je souhaite de data
let thermique = [];
let nucléaire = [];
let eolien = [];
let solaire = [];
let hydraulique = [];
let bioénergies = [];


/*
* Création du graphique à l'initialisation
*/
const ctx = document.getElementById('monGraphique').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020','2021'],
      datasets: [{
        label: `Evolution de la production en ${GLOBAL_DATA.Nom} entre 2013 et 2021 (en Kw/h)`,
        data: prod,
        borderWidth: 1,
        borderColor: 'red',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        }
      }
    }
});

//Fonction pour mettre à jour le chart 
function updateChart (chart, nouveauxDatasets) {
    let dataEvolution = chart.data.datasets[0]


     // Mise à jour des données du graphique en fonction de la valeur de isProd
     dataEvolution.data = isProd ? prod : conso;
     dataEvolution.borderColor = isProd ? 'red' : 'blue';
     dataEvolution.backgroundColor = isProd ? 'rgba(255, 99, 132, 0.5)' : 'rgba(54, 162, 235, 0.5)';
     dataEvolution.label = isProd ?
         `Evolution de la production en ${GLOBAL_DATA.Nom} entre 2013 et 2021 (en Kw/h)` :
         `Evolution de la consommation en ${GLOBAL_DATA.Nom} entre 2013 et 2021 (en Kw/h)`;

    chart.options.scales.y.max = isProd ? 200000000 : 120000000 ;



  //AJOUTER DES LIGNES DANS LE GRAPHIQUE
  //ça fonctionne pas parce que j'ajoute des datasets mais je ne supprime pas les anciennes donc les modification que je fais sur data après casse tt :c

    nouveauxDatasets.forEach((newDataset) => {
      // Crée un nouveau jeu de données (dataset) pour les nouvelles données
      const dataset = {
        label: `test`,
        data: newDataset.data, 
        borderWidth: 1,
        borderColor: newDataset.borderColor, 
        backgroundColor: newDataset.backgroundColor,
      };
  
      // Ajoute le nouveau jeu de données à votre tableau de datasets
      chart.data.datasets.push(dataset);
    });
    
    chart.update();
}

//Création d'un tableau de datasets pour chacune des energies
const nouveauxDatasets = [
  {
    data: thermique,
    borderColor: 'green',
    backgroundColor: 'green',
  },
  {
    data: nucléaire,
    borderColor: 'yellow',
    backgroundColor: 'yellow',
  },
  {
    data: eolien,
    borderColor: 'orange',
    backgroundColor: 'orange',
  },
  {
    data: solaire,
    borderColor: 'purple',
    backgroundColor: 'purple',
  },
  {
    data: hydraulique,
    borderColor: 'pink',
    backgroundColor: 'pink',
  },
  {
    data: bioénergies,
    borderColor: 'brown',
    backgroundColor: 'brown',
  },
];

updateChart(chart, nouveauxDatasets);


//Fonction pour changer de type de données
function changeGlobalData(data, chart) {
    GLOBAL_DATA = data
    //On vide les tableaux
    conso = []
    prod = []

    //selectionne les données et les push dans mes tableaux
    GLOBAL_DATA.Evolution.forEach((element) => { //c'est ici que ça pose problème
        conso.push(element.Consommation);
        prod.push(element.Production);
    });

    updateChart(chart);
}
changeGlobalData(Bretagne, chart)

//Changement du bouton en fonction du type de data
dataType.addEventListener('click', (e) => {
    isProd = !isProd;
    //! pour dire qu'il est false donc je suis en mode consommation par defaut

    updateChart(chart);

    //Changement du bouton 
    document.querySelector('.choice').textContent = isProd ? 'Production' : 'Consommation';
});

/*
* CHANGEMENT DU GRAPH AVEC LE FILTRE NRJ
*/

//CREATION D'UNE NOUVELLE CHART AU CLICK SUR UN BOUTON NRJ
function changeData(data, chart) {
    GLOBAL_DATA = data;

    // Initialisation des tableaux
    thermique = [];
    nucléaire = [];
    eolien = [];
    solaire = [];
    hydraulique = [];
    bioénergies = [];

// Remplissage des tableaux avec les données provenant du JSON
    GLOBAL_DATA.Evolution.forEach((element) => {
        thermique.push(element.Thermique);
        nucléaire.push(element.Nucléaire);
        eolien.push(element.Eolien);
        solaire.push(element.Solaire);
        hydraulique.push(element.Hydraulique);
        bioénergies.push(element.BioEnergies);
    });

    updateChart(chart);
}

/* NRJ.forEach(function (element) {
  element.addEventListener('click', function () {
      changeData(GLOBAL_DATA, chart);
      
      createMultiLineChart(GLOBAL_DATA,chart);

      console.log(thermique);
  });
}); */

//Récupération de l'ID du bouton nrj cliqué
arrayBtnNRJ.forEach((btn) => {
  btn.addEventListener('click',(e) => {
    console.log(e.target.id);

    let id = e.target.id
    arrayData.forEach(array => {
      if(array.Evolution === id) {
        
      }
    })
});
});

//hightlight la ligne du graphique en fonction du bouton avec opacité A FAIRE

//Changement de la région en fonction du bouton
arrayBtnRegions.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        console.log(e.target.id);
        // on déclare une variable qui fait correspondre "id" à l'id de mes <button>
        let id = e.target.id

        //on parcours le tableaux avec les fichier Json et on lui dis que si la valeur de mon champs région = id de mon button, alors je change tt les données du tableau en lui appliquant un nouveau dossier json
        arrayData.forEach(array => {
            if(array.Nom === id) {
                changeGlobalData(array, chart)
            }
        })
    })
})




