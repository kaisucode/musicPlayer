
import json

dataStart = {}
dataEnd = {}
fin = open("schedule.txt", "r")
info = fin.read().splitlines()
fin.close()

thisDayStart = []
thisDayEnd = []
dayCounter = 0

for line in info: 
    if (line == "***"): 
        dataStart[dayCounter] = thisDayStart
        dataEnd[dayCounter] = thisDayEnd
        dayCounter+=1
        thisDayStart = []
        thisDayEnd = []
    else: 
        thisDayStart.append([line[:-12], line[-10:-6]])
        thisDayEnd.append([line[:-12], line[-5:]])

print(dataStart)
print(dataEnd)




with open("classesStart.json", "w") as outfile: 
    json.dump(dataStart, outfile)
with open("classesEnd.json", "w") as outfile: 
    json.dump(dataEnd, outfile)

