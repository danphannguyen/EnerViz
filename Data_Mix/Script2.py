import pandas as pd

dataColumns = ['Region','Date', 'Consommation', 'Production','Thermique', 'Nucleaire', 'Eolien', 'Solaire', 'Hydraulique', 'BioEnergie']
columns = ["Consommation", "Thermique", "NuclÈaire", "Eolien", "Solaire", "Hydraulique", "BioÈnergies"]

# Tester le script sur une region
regionF = ["PaysdelaLoire"]

# List des années dans chaque region
annee = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]

# Initialisation de la variable Dataresult
dataResult = []

# Parcours du tableau des regions
for valR in regionF:

    dataDay = []
    dataMonth = []

    # Parcours du tableau des années
    for valA in annee: 
        
        # Variable dynamique pour le nom du fichier
        file = "./" + valR + "/" + str(valA) + ".xlsx"
        # print(file)
        
        # Lecture du fichier excel
        excel = pd.read_excel(file, engine='openpyxl', sheet_name=None)
        df = pd.DataFrame(excel['Feuil1'])
        # Remplace toute les valeurs '-' par 0
        df = df.replace(['-'], 0)

        # Parcourir les 12 mois ( test réduire à 1 )
        for Month in range(12) :
            
            # Parcours toute les dates possible ( test réduire à 1 )
            for day in range(31) :
                
                # Création de la date à filtrer
                date = str(valA) + "-" + str(Month+1) + "-" + str(day+1)
                
                # Filtrage avec la date voulue ainsi que si df"Consommation" = true
                filter_df = df.loc[(df['Date'] == date ) & (df['Consommation']) & (df['Consommation'] != "ND")]
                
                # Vérification que la date selectionné existe
                if not filter_df['Consommation'].empty:
                    
                    # Sommes pour 1 jour entier
                    totalDconso = filter_df['Consommation'].astype(int).sum()
                    
                    totalDTherm = filter_df['Thermique'].astype(int).sum()
                    totalDNucl = filter_df['NuclÈaire'].astype(int).sum()
                    totalDEol = filter_df['Eolien'].astype(int).sum()
                    totalDSol = filter_df['Solaire'].astype(int).sum()
                    totalDHydrau = filter_df['Hydraulique'].astype(int).sum()
                    totalDBio = filter_df['BioÈnergies'].astype(int).sum()
                    totalDProd = totalDTherm + totalDNucl + totalDEol + totalDSol + totalDHydrau + totalDBio
                    
                    # Ajout des résultats dans data résultats
                    dataDay.append((valR, date, totalDconso, totalDProd, totalDTherm, totalDNucl, totalDEol, totalDSol, totalDHydrau, totalDBio))
                else:
                    # Dans le cas ou la date n'existe pas on sort de la boucle
                    break

            # Création d'un dataframe pour dataDay
            dfDay = pd.DataFrame(dataDay, columns=dataColumns)
            
            # Récupération et sommes des colonnes
            dateM = str(valA) + "-" + str(Month+1)
            totalconso = dfDay['Consommation'].astype(int).sum()
            totalTherm = dfDay['Thermique'].astype(int).sum()
            totalNucl = dfDay['Nucleaire'].astype(int).sum()
            totalEol = dfDay['Eolien'].astype(int).sum()
            totalSol = dfDay['Solaire'].astype(int).sum()
            totalHydrau = dfDay['Hydraulique'].astype(int).sum()
            totalBio = dfDay['BioEnergie'].astype(int).sum()
            
            totalProd = totalTherm + totalNucl + totalEol + totalSol + totalHydrau + totalBio
            
            # Ajout des données dans dataMonth
            dataMonth.append((valR, dateM, totalconso, totalProd, totalTherm, totalNucl, totalEol, totalSol, totalHydrau, totalBio))
            
            # Creation d'un dataframe pour faire la somme des colonnes
            dfMonth = pd.DataFrame(dataMonth, columns=dataColumns)
                        
        # Sommes de toutes les colonnes
        dateA = str(valA)
        c = dfMonth['Consommation'].astype(int).sum()
        p = dfMonth['Production'].astype(int).sum()
        t = dfMonth['Thermique'].astype(int).sum()
        n = dfMonth['Nucleaire'].astype(int).sum()
        e = dfMonth['Eolien'].astype(int).sum()
        s = dfMonth['Solaire'].astype(int).sum()
        h = dfMonth['Hydraulique'].astype(int).sum()
        b = dfMonth['BioEnergie'].astype(int).sum()  
                
        # Rajout la ligne du totale d'une année
        dataMonth.append((valR, dateA, c, p, t, n, e, s, h, b))

        # Affichage des années validées
        print (str(valA) + " ✅")    
        
# Création d'un dataframe pour dataMonth
dfData = pd.DataFrame(dataMonth, columns=dataColumns)

resultPath = './ResultatExcel/' + str(valR) + '.xlsx'

# Création du fichier excel
with pd.ExcelWriter(resultPath,mode='w') as writer:  dfData.to_excel(writer, sheet_name='Feuil1', index=False)

    