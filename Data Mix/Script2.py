import pandas as pd

# regionF = ["Auvergne", "Bourgogne", "Bretagne", "Centre", "GrandEst", "HautsdeFrance", "IledeFrance", "Normandie","NouvelleAquitaine", "Occitanie", "PACA", "PaysdelaLoire"]

# Tester le script sur une seule region
regionF = ["Auvergne"]

# List des années dans chaque region
annee = ["2013"]

# Initialisation de la variable Dataresult
dataResult = []
dataDay = []
dataMonth = []

# Parcours du tableau des regions
for valR in regionF:

    # Parcours du tableau des années
    for valA in annee: 
        
        # Variable dynamique pour le nom du fichier
        file = "./Data Mix/" + valR + "/" + str(valA) + ".xlsx"
        print(file)
        
        # Lecture du fichier excel
        excel = pd.read_excel(file, engine='openpyxl', sheet_name=None)
        df = pd.DataFrame(excel['Feuil1'])
        
        # Parcourir les 12 mois ( test réduire à 1 )
        for Month in range(1) :
            
            # Parcours toute les dates possible ( test réduire à 1 )
            for day in range(35) :
                
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
                    
                    # Ajout des résultats dans data résultats
                    dataDay.append((valR, date, totalDconso, totalDTherm, totalDNucl, totalDEol, totalDSol, totalDHydrau, totalDBio))
                else:
                    # Dans le cas ou la date n'existe pas on sort de la boucle
                    break

            dataDay = pd.DataFrame(dataDay, columns=['Région','Date', 'Consommation', 'Thermique', 'Nucleaire', 'Eolien', 'Solaire', 'Hydraulique', 'BioEnergie'])
            
            print(dataDay)
            
            dateM = str(valA) + "-" + str(Month+1)
            totalconso = dataDay['Consommation'].astype(int).sum()
            totalTherm = dataDay['Thermique'].astype(int).sum()
            totalNucl = dataDay['Nucleaire'].astype(int).sum()
            totalEol = dataDay['Eolien'].astype(int).sum()
            totalSol = dataDay['Solaire'].astype(int).sum()
            totalHydrau = dataDay['Hydraulique'].astype(int).sum()
            totalBio = dataDay['BioEnergie'].astype(int).sum()
            
            dataMonth.append((valR, dateM, totalconso, totalTherm, totalNucl, totalEol, totalSol, totalHydrau, totalBio))
            
            dataMonth = pd.DataFrame(dataMonth, columns=['Région','Date', 'Consommation', 'Thermique', 'Nucleaire', 'Eolien', 'Solaire', 'Hydraulique', 'BioEnergie'])
            
            print(dataMonth)
                
            
        # Affichage des années validées
        # print (str(val) + " ✅")

    # Affichage des régions validées
    # print(str(valR) + " ✅")
    
# Création du dataframe
# data = pd.DataFrame(data)

# Création du fichier excel
# with pd.ExcelWriter('./Resultat/Region.xlsx',mode='a',if_sheet_exists='replace') as writer:  data.to_excel(writer, sheet_name='Feuil1', index=False)

    