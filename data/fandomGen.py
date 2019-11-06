# This program generates the playlist.json file

import json
import os
import sys

data = {}
files = os.listdir("fandom/")
print(files)

for i in range(0, len(files)): 
    data[str(i)] = files[i]

with open('fandomImgList.json', 'w') as outfile: 
    json.dump(data, outfile)

