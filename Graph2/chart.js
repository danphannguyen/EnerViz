import Bretagne from '../Data Mix/ResultatJSON/Bretagne.json' assert { type: "json" };
import IDF from '../Data Mix/ResultatJSON/IledeFrance.json' assert { type: "json" };
import Auvergne from '../Data Mix/ResultatJSON/Auvergne.json' assert { type: "json" };
import Bourgogne from '../Data Mix/ResultatJSON/Bourgogne.json' assert { type: "json" };
import Centre from '../Data Mix/ResultatJSON/Centre.json' assert { type: "json" };
import GrandEst from '../Data Mix/ResultatJSON/GrandEst.json' assert { type: "json" };
import HautsDeFrance from '../Data Mix/ResultatJSON/HautsdeFrance.json' assert { type: "json" };
import Normandie from '../Data Mix/ResultatJSON/Normandie.json' assert { type: "json" };
import NouvelleAquitaine from '../Data Mix/ResultatJSON/NouvelleAquitaine.json' assert { type: "json" };
import Occitanie from '../Data Mix/ResultatJSON/Occitanie.json' assert { type: "json" };
import PaysDeLaLoire from '../Data Mix/ResultatJSON/PaysdelaLoire.json' assert { type: "json" };
import PACA from '../Data Mix/ResultatJSON/PACA.json' assert { type: "json" };

// Permet de récupérer tout les JSON dans une liste que l'on pourra parcourir
let arrayData = [Bretagne, IDF, Auvergne, Bourgogne, Centre, GrandEst, HautsDeFrance, Normandie, NouvelleAquitaine, Occitanie, PaysDeLaLoire, PACA];

// Permet de spécifier les années que l'on cherche ! 
let arrayAnnees = ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'];

// Initalisation du graphique
const ctx = document.getElementById('monGraphique').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'],
        datasets: []
    },
    options: {
        scales: {
            y: {
                type: 'logarithmic',
                beginAtZero: true,
                min: 10,
                max: 2000000000000,
            }
        },
    }
});


// Sélections de tout les boutons filtres
const filters = document.querySelectorAll('.region');

// AddEventlistener 'click' sur chaque boutons
filters.forEach(filter => {
    filter.addEventListener('click', function handleClick(event) {

        // Récupération de l'id dans une variable
        let targetId = event.target.id;

        document.querySelector("#titre").innerHTML = targetId;

        // Comparaison de l'ID et de la case région de chaque object[0]
        arrayData.forEach(array => {
            if (array[0].Region === targetId) {

                // Initialisation des tableaux
                let dataThermique = [];
                let dataNucleaire = [];
                let dataEolien = [];
                let dataSolaire = [];
                let dataHydraulique = [];
                let dataBioenergie = [];
                // Permet de lister toutes les Energies que l'on cherche
                let arrayNRJ = []

                // Parcours de tout les éléments contenu dans le JSON sélectionné
                array.forEach((element) => {

                    // Comparaison avec la liste d'années voulue
                    arrayAnnees.forEach((annee) => {

                        // Push dans les tableaux seulement si la date correspond
                        if (element.Date == annee) {
                            dataThermique.push(element.Thermique);
                            dataNucleaire.push(element.Nucleaire);
                            dataEolien.push(element.Eolien);
                            dataSolaire.push(element.Solaire);
                            dataHydraulique.push(element.Hydraulique);
                            dataBioenergie.push(element.BioEnergie);
                        }

                    });
                });

                // Si aucun filtre sélectionné
                if (arrayNRJ.length == 0) {
                    // Créations d'object avec insertions des tableaux
                    arrayNRJ = [
                        {
                            "name": "Thermique",
                            "data": dataThermique,
                            "bColor": "RGBA(84,84,84,1)",
                            "bgColor": "RGBA(84,84,84,0.5)"
                        },
                        {
                            "name": "Nucleaire",
                            "data": dataNucleaire,
                            "bColor": "RGBA(215,252,212,1)",
                            "bgColor": "RGBA(215,252,212,0.5)"
                        },
                        {
                            "name": "Eolien",
                            "data": dataEolien,
                            "bColor": "blue",
                            "bgColor": "rgba(255, 99, 132, 0.5)"
                        },
                        {
                            "name": "Solaire",
                            "data": dataSolaire,
                            "bColor": "yellow",
                            "bgColor": "rgba(255, 99, 132, 0.5)"
                        },
                        {
                            "name": "Hydraulique",
                            "data": dataHydraulique,
                            "bColor": "yellow",
                            "bgColor": "rgba(255, 99, 132, 0.5)"
                        },
                        {
                            "name": "Bioenergie",
                            "data": dataBioenergie,
                            "bColor": "purple",
                            "bgColor": "rgba(255, 99, 132, 0.5)"
                        }
                    ];
                }


                // Ajout de datasets pour chaque energie avec les values 
                arrayNRJ.forEach(energie => {
                    addData(energie.name, energie.data, energie.bColor, energie.bgColor);
                })

                // console.log(myChart.data.datasets);
            }
        });

    });

});


function addData(newLabel, newData, newBColor, newBgColor) {

    // La variable "state" permet de garder une info en mémoire
    let state = 0

    // Vérification de si il y a des datasets
    if (myChart.data.datasets.length == 0) {

        // Si vide création du premier
        createDatasets (newLabel, newData, newBColor, newBgColor);

    } else {
        // console.log("==== OLD DATASET ====")
        // console.log(myChart.data.datasets)
        // console.log("==== OLD DATASET ====")

        // console.log("==== NEW DATASET ====")
        // console.log(newLabel)
        // console.log(newData)
        // console.log("==== NEW DATASET ====")

        // Vérification que si le newlabel n'est pas déjà présent dans tout les datatsets créés
        myChart.data.datasets.forEach(dataset => {
            if (dataset.label == newLabel) {
                // Ici si le dataset est déjà présent on ajoute 1 à state
                state = state + 1
            } else {
                // Si il ne l'est pas on y ajoute 0
                state = state + 0
            }
        });

        // Après avoir comparé le dataset que l'on veut ajouté avec tout ceux déjà créé, si la var state est à 0 donc qu'il n'est pas déjà présent, on le rajoute
        if (state == 0) {
            createDatasets (newLabel, newData, newBColor, newBgColor);
        } else {
            // Sinon il faut l'update
            let index = myChart.data.datasets.map(object => object.label).indexOf(newLabel);
            let i = 0
            myChart.data.datasets[index].data.forEach(value => {
                myChart.data.datasets[index].data[i] = newData[i]
                i += 1;
            })
        }
    }
    myChart.update();
}


function createDatasets (newLabel, newData, newBColor, newBgColor) {
    myChart.data.datasets.push({
        label: newLabel,
        data: newData,
        borderWidth: 1,
        borderColor: newBColor,
        backgroundColor: newBgColor,
        pointStyle: 'circle',
        pointRadius: 7.5,
        pointHoverRadius: 10,
    });
}

function removeData(chart) {

    console.log(chart.data.datasets);

    // chart.data.datasets.forEach((dataset) => {
    //     chart.data.datasets.pop()
    // });

    myChart.update();
}