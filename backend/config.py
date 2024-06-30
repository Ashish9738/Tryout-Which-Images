from typing import List

class AppConfig:
    ORIGINS = ["*"] 
    
    #Base URL for Storage Service👇
    STORAGE_BASE_URL = "https://storage.cialabs.org"


    #URL of the Model As Service to fetch the result for the Test Model👇
    MAS_SERVICE_URL = "https://cia-mas.cialabs.org/"
    MAS_SERVICE_ENDPOINT = "upload/"

    # url for connect mongoDB 👇
    mongo_url= 'mongodb+srv://which-img:cialabsintern@atlascluster.mytwvuv.mongodb.net/'