import { Application } from '@splinetool/runtime';

// Fonction pour charger un fichier JSON à partir d'une URL
async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('Il y a eu un problème avec le chargement du fichier JSON:', error);
        throw error; // Rejeter l'erreur pour la gestion ultérieure
    }
}

// Fonction principale pour charger toutes les données JSON nécessaires
async function loadData() {
    try {
        // Chemins des fichiers JSON
        const urls = [
            '/Data_Mix/ResultatJSON/Bretagne.json',
            '/Data_Mix/ResultatJSON/IledeFrance.json',
            '/Data_Mix/ResultatJSON/Auvergne.json',
            '/Data_Mix/ResultatJSON/Bourgogne.json',
            '/Data_Mix/ResultatJSON/Centre.json',
            '/Data_Mix/ResultatJSON/GrandEst.json',
            '/Data_Mix/ResultatJSON/HautsdeFrance.json',
            '/Data_Mix/ResultatJSON/Normandie.json',
            '/Data_Mix/ResultatJSON/NouvelleAquitaine.json',
            '/Data_Mix/ResultatJSON/Occitanie.json',
            '/Data_Mix/ResultatJSON/PaysdelaLoire.json',
            '/Data_Mix/ResultatJSON/PACA.json',
            '/Data_Mix/ResultatJSON/National.json'
        ];
        
        // Charger toutes les données JSON en parallèle
        const dataPromises = urls.map(url => loadJSON(url));
        const [
            Bretagne, IDF, Auvergne, Bourgogne, Centre, GrandEst, HautsDeFrance, 
            Normandie, NouvelleAquitaine, Occitanie, PaysDeLaLoire, PACA, National
        ] = await Promise.all(dataPromises);

        // Permet de récupérer tout les JSON dans une liste que l'on pourra parcourir
        let arrayData = [Bretagne, IDF, Auvergne, Bourgogne, Centre, GrandEst, HautsDeFrance, Normandie, NouvelleAquitaine, Occitanie, PaysDeLaLoire, PACA];

        // Récupère les value de chaque Energies dans le JSON National
        let arrayDataNational = [];
        National.forEach((element) => { 
            arrayDataNational.push(element.Value);
        });

        // Permet de spécifier les années que l'on cherche ! 
        let arrayAnnees = ['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'];

        // Permet de Garder en mémoire les énergies pour le prod / conso
        let arrayNRJ = []
        let arrayConso = []

        // Initialise une instance du offCanvas Bootstrap
        var offcanvasElement = document.getElementById("offcanvasScrolling");
        var offcanvas = new bootstrap.Offcanvas(offcanvasElement);

        // Initialisation du mode pour changement du titre
        let mode = "Production";
        let printHtml = ""

        // Initialisation du graphique
        const ctx = document.getElementById('monGraphique').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: arrayAnnees,
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
                // console.log("Label: " + clickedLabel);
                // console.log("Value: " + clickedValue);

                // Formater la valeur avec des séparateurs tous les trois chiffres
                var formattedValue = clickedValue.toLocaleString();
                
                // Affichage des informations dans le HTML
                document.getElementById('affichage-annee').innerHTML = "En " + clickedLabel;
                document.getElementById('total').innerHTML = formattedValue + " TWh";

                // Affichage de la div
                document.getElementById('affichage').classList.remove('opacity');
            } 
        };

        // Légende à droite
        myChart.options.plugins.legend.position = 'bottom';
        myChart.update();

        // Initialisation du loader, attente de 10 secondes avant de le cacher et d'afficher la modal 
        window.addEventListener('load', function () {
            setTimeout(function () {
                document.getElementById('loader').style.display = 'none';
                $('#welcome-modal').modal('show');
                $('footer').css('display', 'block');
            }, 10000);
            
            $('#welcome-modal').on('shown.bs.modal', function () {
                $('#mentionlegales').css('pointer-events', 'none');
            });

            $('#welcome-modal').on('hidden.bs.modal', function () {
                $('#mentionlegales').css('pointer-events', 'auto');
            });
        });

        // Initialisation de canvas Spline
        const canvas = document.getElementById('canvas3d');
        const app = new Application(canvas);

        app.load('https://prod.spline.design/7ro9L-eFB8YM5Ktn/scene.splinecode')
            .then(() => {
                console.log('Scène chargée avec succès!');
            })
            .catch(error => {
                console.error("Une erreur s'est produite lors du chargement de la scène:", error);
            });

        // Réalise un addEventListener sur le canvas
        app.addEventListener('mouseDown', (e) => {
            // Initialise la valeur de targetId
            let targetId = ""
            let titreHtml = ""
            let eTarget = ""

            // console.log(e.target.name)
            // switch case qui permet de définir la valeur de targetId en fonction du nom de l'objet cliqué
            switch (e.target.name) {
                // ==== Energie ==== //
                case "Nucleaire":
                    eTarget = "Nucleaire";
                    break;
                case "Charbon":
                    eTarget = "Thermique";
                    break;
                case "Bio":
                    eTarget = "Bio-Energie";
                    break;
                case "Barage":
                    eTarget = "Hydraulique";
                    break;
                case "Solaire":
                    eTarget = "Solaire";
                    break;
                case "Eolien":
                    eTarget = "Eolien";
                    break;
                // ==== REGION PIN ==== //
                case "Pin B":
                    targetId = "Bretagne";
                    titreHtml = "Bretagne";
                    break;
                case "Eiffel Tower":
                    targetId = "IledeFrance";
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
                case "BFC":
                case "CVL":
                case "GE":
                case "HF":
                case "N":
                case "NA":
                case "O":
                case "PL":
                case "PACA":
                    targetId = e.target.name;
                    titreHtml = e.target.name;
                    break;
                default:
                    targetId = "";
                    titreHtml = "";
                    break;
            }

            // Effectue des actions seulement si targetId a une valeur
            if (targetId) {
                // Affichage de la modale avec des informations spécifiques
                offcanvas.show();
                document.getElementById('titre').innerHTML = titreHtml;
                document.getElementById('nombre').innerHTML = eTarget;
                document.getElementById('titre-chiffre').innerHTML = eTarget;

                // Réinitialisation des datasets du graphique
                myChart.data.datasets = [];
                myChart.update();
                
                // Ajout des nouveaux datasets et mise à jour du graphique
                arrayData.forEach(data => {
                    let jsonData = data;
                    let label = jsonData["Region"] || "Inconnu"; // Fournir une valeur par défaut
                    let dataset = {
                        label: label,
                        data: [],
                        borderColor: '#3e95cd',
                        backgroundColor: 'rgba(62, 149, 205, 0.2)',
                        fill: false
                    };
                    arrayAnnees.forEach(annee => {
                        dataset.data.push(jsonData["Data"] && jsonData["Data"][annee] ? jsonData["Data"][annee] : 0);
                    });
                    myChart.data.datasets.push(dataset);
                });

                myChart.update();
            }
        });

    } catch (error) {
        console.error('Une erreur est survenue:', error);
    }
}

// Appel de la fonction principale pour charger les données
loadData();
