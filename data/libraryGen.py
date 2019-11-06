# This program updates the library.json file

import json
import os

data = {}
files = os.listdir("mp3/")
files = sorted(files, key=str.casefold)

# mp3 files
for i in range(0, len(files)): 
    data[str(i)] = files[i]

# playlist files
x = 0
playlistFiles = os.listdir("playlists/")
for i in range(len(files), len(files)+len(playlistFiles)-1): 
    data[str(i)] = "New"+str(x)+".json"
    x+=1
#  print(data)

with open('library.json', 'w') as outfile: 
    json.dump(data, outfile)

ratings = {}
for key in data: 
    ratings[data[key]] = 0

with open('ratings.json', 'w') as outfile: 
    json.dump(ratings, outfile)


