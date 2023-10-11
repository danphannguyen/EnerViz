import pandas as pd
import time
import requests

# result_chiffreclesXLSX =r"/Applications/MAMP/htdocs/jaguarStork_database/Script_database/BaseEnCoursINPI.xlsx"

# rolesfile=r"/Applications/MAMP/htdocs/jaguarStork_database/Script_database/INPI_CODE.xlsx"


# ================== REQUEST PART ==================

# URLs
urlLogin = "https://registre-national-entreprises.inpi.fr/api/sso/login"
inpi = "https://registre-national-entreprises.inpi.fr/api/companies/"

data = {
    "username": "julie@relevia.fr",
    "password": "Stagestage1!"
}

response = requests.post(urlLogin, json=data)
access_token = response.json()['token']
print("LETS GOOO L'INPI MARCHE")

headers = {
    "Authorization": "Bearer " + access_token
}

# ==================================================

sourceData = pd.read_excel('/Applications/MAMP/htdocs/jaguarStork_database/inpi_part/BaseEnCours.xlsx', sheet_name='Feuil1')

stakeholders_data=[]

stakeholders_code = ["28","29","51","52","53",]

# ================== SIREN PART ==================

max_itération = 1089

printSiren = 0

count = 0

sirenData = sourceData['Siren']
DNData = sourceData['Denomination']

df = pd.DataFrame(sirenData)
df['Denomination'] = DNData

for index, row in df.head(max_itération).iterrows():
    
    siren = row['Siren']
    DNname = row['Denomination']
    url = f"https://registre-national-entreprises.inpi.fr/api/companies/{siren}"
    
    response = requests.get(url,headers=headers)
    
    try:
        pouvoirs = response.json(
)['formality']['content']['personneMorale']['composition']['pouvoirs']
    except KeyError:
    # handle the case where the key is missing
        pouvoirs = []
        

    for personne in pouvoirs:
        if personne['typeDePersonne'] == 'INDIVIDU':
            premier_individu = personne
            break
            
    for pouvoir in pouvoirs:
        individu = pouvoir.get('individu')
        
        if individu and individu.get('descriptionPersonne', {}).get('role') in stakeholders_code:
            try:
                nom = individu['descriptionPersonne']['nom']
                prenoms = ",".join(individu['descriptionPersonne']['prenoms'])
                role = individu['descriptionPersonne']['role']
            except:
                nom = "Missing Arguments"
                role = "Missing Arguments"
                prenoms = "Missing Arguments"
            
            stakeholders_data.append((DNname,siren,nom, prenoms,role))    
            
            print("Siren "+ str(siren) +" "+str(count))
            count =count +1
        else:
            if not printSiren == siren :
                try:
                    nom = premier_individu['individu']['descriptionPersonne']['nom']
                    prenoms = ",".join(premier_individu['individu']['descriptionPersonne']['prenoms'])
                    role = "NaN"
                except:
                    nom = "Missing Arguments"
                    role = "Missing Arguments"
                    prenoms = "Missing Arguments"
                    
                stakeholders_data.append((DNname,siren,nom, prenoms,role))
                printSiren = siren        
    
stakeholders_df = pd.DataFrame(stakeholders_data, columns=['Denomination','Siren', 'Nom', 'Prenoms', 'Code'])

print(stakeholders_df)

with pd.ExcelWriter('/Applications/MAMP/htdocs/jaguarStork_database/inpi_part/BaseEnCours.xlsx',mode='a',if_sheet_exists='replace') as writer:  stakeholders_df.to_excel(writer, sheet_name='Stakeholders', index=False)