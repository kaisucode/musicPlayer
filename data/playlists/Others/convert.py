# This program creates the playlist json file by reading in the .p files previously used

import json
import os
import sys

def convert(file_num): 
    data = {}
    fin = open("New"+file_num+".p", "r")
    files = fin.readlines()

    for i in range(0, len(files)): 
        data[str(i)] = files[i][:-1]
    print(data)

    with open('New'+file_num+'.json', 'w') as outfile: 
        json.dump(data, outfile)

fileNo = str(sys.argv[1])


convert(fileNo)
#  for x in range(0, 10): 
#      convert(x)

