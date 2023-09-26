import pandas as pd

regionF = ["Auvergne", "Bourgogne", "Bretagne", "Centre", "GrandEst", "HautsdeFrance", "IledeFrance", "Normandie","NouvelleAquitaine", "Occitanie", "PACA", "PaysdelaLoire"]

# Tester le script sur une seule region
# regionF = ["Centre"]

# List des années dans chaque region
annee = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]

# Initialisation du tableau qui va contenir les données
data= []

# Parcours du tableau des regions
for valR in regionF:

    # Parcours du tableau des années
    for val in annee: 
        
        # Variable dynamique pour le nom du fichier
        file = "./" + valR + "/" + str(val) + ".xlsx"
        
        # Lecture du fichier excel
        excel = pd.read_excel(file, engine='openpyxl', sheet_name=None)
        df = pd.DataFrame(excel['Feuil1'])

        
        # Parcourir les 12 mois
        count = 0 
        for i in range(12) :
            count += 1
            # Création de la date à filtrer
            date = str(val) + "-" + str(count) + "-" + "1" 
            
            # Filtrage avec la date voulue
            filter_df = df.loc[(df['Date'] == date)]
            
            # Ajout de la date dans le tableau ( avec le même horaire)
            data.append(filter_df.iloc[10])
            
        # Affichage des années validées
        print (str(val) + " ✅")

    # Affichage des régions validées
    print(str(valR) + " ✅")
    
# Création du dataframe
data = pd.DataFrame(data)

# Création du fichier excel
with pd.ExcelWriter('./Resultat/Region.xlsx',mode='a',if_sheet_exists='replace') as writer:  data.to_excel(writer, sheet_name='Feuil1', index=False)

    