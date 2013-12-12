import csv



trafico_all_r = csv.reader(open("trafico_entrante.csv", "r", newline=""))
print ("algo")
trafico_all = []
for estacion in trafico_all_r:
    print (estacion[1])
    trafico_all.append(estacion[2:])
#print (trafico_all)




data = {}
trafic = []
stations = {}
stations_r = csv.reader(open("PromedioSubidasMetroSantiago.csv", "r", newline=""))
next(stations_r)


i=0
for row in stations_r:
    name = row[0]
    print (name)
    id = row[1]
    if(name!="Total" and name!="Check total"):
    
        stations[name] = {
            "id": row[1],
            "name": name,
            "trafic_avg": float(row[4]),
            "trafic": trafico_all[i],
            "lines": [],
            "rank": 0,
            "latitude": row[3],
            "longitude": row[2],
            "url":row[5],
        }
    else:
        stations[name] = {
            "id": row[1],
            "name": name,
            "trafic_avg": float(row[4]),
            "trafic": float(row[4]),
            "lines": [],
            "rank": 0,
            "latitude": row[3],
            "longitude": row[2],
            "url":row[5],
        }
    i+=1
    trafic.append(float(row[4]))
    
    

trafic.sort(reverse=True)

lines = {}
order_r = csv.reader(open("SantiagoStationsOrder.csv", "r", newline=""))
next(order_r)
for row in order_r:
    line = row[0]
    name = row[1]
    stations[name]["lines"].append(line)
    if line not in lines:
        lines[line] = []
    lines[line].append((name, int(row[4])))





data["lines"] = []
for name, lstations in lines.items():
    lstations.sort(key=lambda x: x[1])
    lstations = [stations[e[0]]["id"] for e in lstations]
    data["lines"].append({
        "key": name,
        "paths": [lstations],
    })

data["freq"] = {}
for name, station in stations.items():
    #print (name)
    data["freq"][station["id"]] = {
        "name": name,
        "lines": station["lines"],
        "rank": trafic.index(station["trafic_avg"]),
        "key": station["id"],
        "latitude": station["latitude"],
        "longitude": station["longitude"],
        "connexion": {},
        "trafic": station["trafic"],
        "trafic_avg": station["trafic_avg"]
    }

import json

json.dump(data, open("santiago_alltrafic.json", "w"), indent=2)


lines_r = csv.reader(open("SantiagoLines.csv", "r", newline=""))
next(lines_r)
css = open("santiago.colors.css", "w")
for row in lines_r:
    css.write("""
    .line_%(line)s {
        fill: #%(fill)s;
        stroke: #%(stroke)s;
        background-color: #%(bg)s;
    }

    """ % {
        "line": row[0][:2] + row[0][2:].lower(),
        "fill": row[7],
        "stroke": row[7],
        "bg": row[7],
    })
