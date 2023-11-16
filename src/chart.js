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

import { Application } from '@splinetool/runtime';

// Permet de récupérer tout les JSON dans une liste que l'on pourra parcourir
let arrayData = [Bretagne, IDF, Auvergne, Bourgogne, Centre, GrandEst, HautsDeFrance, Normandie, NouvelleAquitaine, Occitanie, PaysDeLaLoire, PACA];

// Permet de spécifier les années que l'on cherche ! 
let arrayAnnees = ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'];

// Permet de Garder en mémoire les énergies pour le prod / conso
let arrayNRJ = []
let arrayConso = []

// Initialise une instance du offCanvas Bootstrap
var offcanvasElement = document.getElementById("offcanvasScrolling");
var offcanvas = new bootstrap.Offcanvas(offcanvasElement);

// Initailisation du mode pour changement du titre
let mode = "Production";
let printHtml = ""

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
                min: 1000000,
                max: 2000000000000,
                responsive: true,
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Lorem ipsum dolore'
            }
        },
    }
});

// Ajout d'un gestionnaire d'événement au clic
document.getElementById('monGraphique').onclick = function(evt) {
    var activePoints = myChart.getElementsAtEventForMode(evt, 'nearest', {intersect: true}, true);

    if (activePoints.length > 0) {
        var clickedDatasetIndex = activePoints[0].datasetIndex;
        var clickedDataIndex = activePoints[0].index;
        var clickedValue = myChart.data.datasets[clickedDatasetIndex].data[clickedDataIndex];
        var clickedLabel = myChart.data.labels[clickedDataIndex];

        // Affichage des informations dans la console
        /* console.log("Label: " + clickedLabel);
        console.log("Value: " + clickedValue); */

        // Formater la valeur avec des séparateurs tous les trois chiffres
        var formattedValue = clickedValue.toLocaleString();
        
        // Affichage des informations dans le HTML
        document.getElementById('affichage-annee').innerHTML = "En " + clickedLabel;
        document.getElementById('total').innerHTML = formattedValue + " TWh";

        // Affichage de la div
        document.getElementById('affichage').classList.remove('opacity');
    } 
};

//DAB J'AI REUSSI 

//Légende à droite
myChart.options.plugins.legend.position = 'bottom';
myChart.update();

//Fonction pour initialiser le loader en fonction d'un temps donner
window.addEventListener('load', function () {
    setTimeout(function () {
        document.getElementById('loader').style.display = 'none';
    }, 10000);
});

// Initialisation de canvas Spline
const canvas = document.getElementById('canvas3d');
const app = new Application(canvas);

app.load('https://prod.spline.design/7ro9L-eFB8YM5Ktn/scene.splinecode')
    .then(() => {
        const nuc = app.findObjectByName('Nucleaire');
        const barage = app.findObjectByName('Barage');
        const cam1 = app.findObjectByName('CamBase');

        // console.log(nuc);
        // console.log(barage);
        // console.log(cam1);

        // for (const AllObjects of app.getAllObjects()) {
        //   console.log(AllObjects.name);
        //   console.log(AllObjects);
        // }

    })

    .catch(error => {
        console.error("Une erreur s'est produite lors du chargement de la scène:", error);
    });

// Réalise un addEventListener sur le canvas
app.addEventListener('mouseDown', (e) => {

    // initialise la valeur de targetId
    let targetId = ""
    let titreHtml = ""

    // console.log(e.target.name)
    // switch case qui permet de définir la valeur de targetId en fonction du nom de l'objet cliqué
    switch (e.target.name) {
        // ==== REGION PIN ==== //
        case "Pin B":
            targetId = "Bretagne";
            titreHtml = "Bretagne";
            break;
        case "Eiffel Tower":
            targetId = "IDF";
            titreHtml = "Ile de France";
            break;
        case "Pin ARA":
            targetId = "Auvergne";
            titreHtml = "Auvergne Rhône Alpes";
            break;
        case "Pin BFC":
            targetId = "Bourgogne";
            titreHtml = "Bourgogne-Franche-Comté";
            break;
        case "Pin CVL":
            targetId = "Centre";
            titreHtml = "Centre Val de Loire";
            break;
        case "Pin GE":
            targetId = "GrandEst";
            titreHtml = "Grand Est";
            break;
        case "Pin HF":
            targetId = "HautsdeFrance";
            titreHtml = "Hauts de France";
            break;
        case "Pin N":
            targetId = "Normandie";
            titreHtml = "Normandie";
            break;
        case "Pin NA":
            targetId = "NouvelleAquitaine";
            titreHtml = "Nouvelle Aquitaine";
            break;
        case "Pin O":
            targetId = "Occitanie";
            titreHtml = "Occitanie";
            break;
        case "Pin PL":
            targetId = "PaysdelaLoire";
            titreHtml = "Pays de la Loire";
            break;
        case "Pin PACA":
            targetId = "PACA";
            titreHtml = "Provence Alpes Côte d'Azur";
            break;
        // ==== REGION ZONE ==== //
        case "B":
        case "IDF":
        case "ARA":
        case "BCF":
        case "CVL":
        case "GE":
        case "HF":
        case "N":
        case "NA":
        case "O":
        case "PL":
        case "PACA":
            targetId = "Fermeture";
            break;

        // ==== AUTRES ==== //
        default:
            targetId = "undefined";
            break;
    }

    // AddEventlistener 'click' sur chaque boutons
    if (targetId != "undefined" || targetId != "Fermeture") {

        $("#daveText").removeClass("show");
        // // Récupération de l'id dans une variable
        // let targetId = event.target.id;

        // Vérification de si titreHtml est vide ou non
        if (titreHtml != "") {
            // Permet de changer le titre de la modal
            document.querySelector("#titre").innerHTML = titreHtml;

            // Permet d'ouvrir la modal / Reset les checkbox et les afficher
            offcanvas.show();
            $("#filterContainer").css("display", "flex");
            $(".filter").prop("checked", false);
        }

        // Actualisation du titre du graphique
        printHtml = titreHtml
        myChart.options.plugins.title.text = mode + " totale en " + printHtml;


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
                let dataConso = [];
                arrayNRJ = []
                arrayConso = []

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
                            dataConso.push(element.Consommation)
                        }

                    });
                });

                // Permet de sauvegarder dans un object les valeurs conso
                arrayConso = [
                    {
                        "name": "Consommation Globale",
                        "data": dataConso,
                        "bColor": "RGB(255, 108, 0)",
                        "bgColor": "RGB(255, 108, 0)",
                    },
                ]

                // Si aucun filtre sélectionné
                if (arrayNRJ.length == 0) {
                    // Créations d'object avec insertions des tableaux
                    arrayNRJ = [
                        {
                            "name": "Thermique",
                            "data": dataThermique,
                            "bColor": "RGB(255, 108, 0)",
                            "bgColor": "RGB(255, 108, 0)",
                        },
                        {
                            "name": "Nucleaire",
                            "data": dataNucleaire,
                            "bColor": "RGB(147, 222, 134 )",
                            "bgColor": "RGB(147, 222, 134 )",
                        },
                        {
                            "name": "Eolien",
                            "data": dataEolien,
                            "bColor": "RGB(180, 244, 239 )",
                            "bgColor": "RGB(180, 244, 239 )",
                        },
                        {
                            "name": "Solaire",
                            "data": dataSolaire,
                            "bColor": "rgb(255, 241, 106)",
                            "bgColor": "rgb(255, 241, 106 )",
                        },
                        {
                            "name": "Hydraulique",
                            "data": dataHydraulique,
                            "bColor": "rgb(143, 167, 252 )",
                            "bgColor": "rgb(143, 167, 252 )",
                        },
                        {
                            "name": "Bioenergie",
                            "data": dataBioenergie,
                            "bColor": "rgb(255, 189, 235 )",
                            "bgColor": "rgb(255, 189, 235 )",
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

    };

    // Si target = fermeture on cache le offcanvas
    if (targetId == "Fermeture") {

        // Lors de la fermeture on reset de force le canva en le remettant en mode Production et en vidant le dataset
        isProd = true;
        $("#Consommation").css("opacity", 1)
        $("#Production").css("opacity", 0.25)
        myChart.data.datasets = [];

        // Actualisation du titre du graphique
        mode = "Production";
        myChart.options.plugins.title.text = mode + " totale en " + printHtml + "(TWh)";

        // Si production on rajoute tout les energies sauvegarder en mémoire
        arrayNRJ.forEach(energie => {
            addData(energie.name, energie.data, energie.bColor, energie.bgColor);
        })

        // Reset des filter + display none / fermeture du offcanvas / update du graphique
        $(".filter").prop("checked", false);
        $("#filterContainer").css("display", "none");
        $("#affichage").addClass("opacity");

        offcanvas.hide();
        myChart.update();
    }

});


function addData(newLabel, newData, newBColor, newBgColor) {

    // La variable "state" permet de garder une info en mémoire
    let state = 0

    // Vérification de si il y a des datasets
    if (myChart.data.datasets.length == 0) {

        // Si vide création du premier
        createDatasets(newLabel, newData, newBColor, newBgColor);

    } else {

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
            createDatasets(newLabel, newData, newBColor, newBgColor);
        } else {
            // Sinon il faut l'update
            // Recherche de l'index de l'objet à partir du nouveau label
            let index = myChart.data.datasets.map(object => object.label).indexOf(newLabel);

            let i = 0
            myChart.data.datasets[index].data.forEach(value => {
                // permet de remplacer les datas d'index [i]
                myChart.data.datasets[index].data[i] = newData[i]
                i += 1;
            })
        }
    }

    // On verifie si il y a des datasets de créer
    if (myChart.data.datasets.length > 0) {
        let i = 0;
        // Pour chaque datasets
        for (let step = 0; step < myChart.data.datasets.length; step++) {
            // on vérifie si celui-ci est visible
            let isDatashow = myChart.isDatasetVisible(i);

            // Si il n'est pas visible on le rend visible
            if (isDatashow === false) {
                myChart.show(i);
            }

            // Et on incrémente i pour passer au dataset suivant ;)
            i += 1;
        }
    }

    myChart.update();
}

// fonction prenant en compte les datas et créer les permiers datasets
function createDatasets(newLabel, newData, newBColor, newBgColor) {
    myChart.data.datasets.push({
        label: newLabel,
        data: newData,
        borderWidth: 1.5,
        borderColor: newBColor,
        backgroundColor: newBgColor,
        pointStyle: 'circle',
        pointRadius: 3,
        pointHoverRadius: 8,
    });
}

// Initialisation de isProd a true
let isProd = true;

$(".choice").click(function (event) {
    // Récupération de l'id sur le bouton cliqué
    const id = event.target.id;
    
    // Comparaison de Consommation ou Production
    if (id == "Production") {
        isProd = true;
        $("#Consommation").css("opacity", 1)
        $("#Production").css("opacity", 0.25)
    } else {
        isProd = false;
        $("#Consommation").css("opacity", 0.25)
        $("#Production").css("opacity", 1)
    }

    // On vide le dataset par précaution
    myChart.data.datasets = [];

    if (isProd == true) {

        // Actualisation du titre du graphique
        mode = "Production";
        myChart.options.plugins.title.text = mode + " totale en " + printHtml + "(TWh)";

        // Si production on rajoute tout les energies sauvegarder en mémoire
        arrayNRJ.forEach(energie => {
            addData(energie.name, energie.data, energie.bColor, energie.bgColor);
        })

        // Affichage des filtre en mode Production
        $("#filterContainer").css("display", "flex");

    } else {

        // Actualisation du titre du graphique
        mode = "Consommation";
        myChart.options.plugins.title.text = mode + " totale en " + printHtml + "(TWh)";

        // Si consommation on l'objet conso sauvegarder en mémoire
        arrayConso.forEach(conso => {
            addData(conso.name, conso.data, conso.bColor, conso.bgColor);
        })

        // Cacher les filtres en mode Consommation
        $("#filterContainer").css("display", "none");

    }

    // Reset des filtres lors du changement & Update du charts
    $(".filter").prop("checked", false);
    myChart.update();

});


// Permet de détecter le click sur tout les .filter
$(".filter").click(function () {

    // Récupere la valeur de la checkbox cliquer
    let value = $(this).val();

    // Permet a dave de parler si / Verification que le offcanvas est fermé
    // if ($("#offcanvasScrolling").hasClass("show") == false) {
    //     $("#daveText").addClass("show");
    //     $("#daveText").text("Merci de d'abord selectionner une région! Pour cela clique sur un des pins de la carte");
    // }

    // Vérification de si la checkbox est coché
    if (this.checked == true) {
        // Vérifie si le dataset est déjà visible ou non
        let isDatashow = myChart.isDatasetVisible(value);

        // Si il n'est pas visible
        if (isDatashow === true) {
            let i = 0;
            for (let step = 0; step < myChart.data.datasets.length; step++) {
                myChart.hide(i);
                i += 1;
            }
            // On l'affiche
            myChart.show(value);
        } else {
            // Sinon on le cache
            myChart.show(value);
        }
    } else {
        // Si la checkbox n'est pas cocher on cache le dataset
        myChart.hide(value);
    }

});

