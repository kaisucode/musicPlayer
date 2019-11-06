# This program updates the library.json file

import json
import os

fileNo = "11"

data = {}
files = os.listdir("New"+fileNo+"/")
files = sorted(files, key=str.casefold)
print(files)

for i in range(0, len(files)): 
    data[str(i)] = files[i]

with open('New'+fileNo+'.json', 'w') as outfile: 
    json.dump(data, outfile)

