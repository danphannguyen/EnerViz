import Bretagne from './Bretagne.json' assert { type: "json" };
import IDF from './IledeFrance.json' assert { type: "json" };


/*
* variables
*/
let GLOBAL_DATA = Bretagne;

let dataType = document.querySelector('.choice');
let btnBretagne = document.getElementById('Bretagne');
let btnIDF = document.getElementById('Ile-de-France');

let arrayBtnRegions = [btnBretagne, btnIDF]
let arrayData = [Bretagne, IDF]

let conso = []; //création de 2 tableaux pour cibler les éléments que je souhaite de data
let prod =  [];

let isProd = true;


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
function updateChart (chart) {
    let dataEvolution = chart.data.datasets[0]

     // Mise à jour des données du graphique en fonction de la valeur de isProd
     dataEvolution.data = isProd ? prod : conso;
     dataEvolution.borderColor = isProd ? 'red' : 'blue';
     dataEvolution.backgroundColor = isProd ? 'rgba(255, 99, 132, 0.5)' : 'rgba(54, 162, 235, 0.5)';
     dataEvolution.label = isProd ?
         `Evolution de la production en ${GLOBAL_DATA.Nom} entre 2013 et 2021 (en Kw/h)` :
         `Evolution de la consommation en ${GLOBAL_DATA.Nom} entre 2013 et 2021 (en Kw/h)`;

     chart.options.scales.y.max = isProd ? 8000000 : 200000000 ;

    chart.update();
}

//Fonction pour changer de fichier json
function changeGlobalData(data, chart) {
    GLOBAL_DATA = data
    //On vide les tableaux
    conso = []
    prod = []

    //selectionne les données et les push dans mes tableaux
    GLOBAL_DATA.Evolution.forEach((element) => {
        conso.push(element.Consommation);
        prod.push(element.Thermique);
    });
    //map retourne un tableau

    updateChart(chart);
}
changeGlobalData(Bretagne, chart)

//Changement du bouton en fonction du type de data
dataType.addEventListener('click', (e) => {
    isProd = !isProd;
    //! pour dire qu'il est false donc je suis en mode consommation

    updateChart(chart);

    //Changement du bouton 
    document.querySelector('.choice').textContent = isProd ? 'Production' : 'Consommation';
});


//
arrayBtnRegions.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        //console.log(e.target.id);
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


