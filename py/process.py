import csv

data = {}

trafic = []

stations = {}
stations_r = csv.reader(open("SantiagoTrafic.csv", "r", newline=""))
next(stations_r)
for row in stations_r:
    name = row[0]
    id = row[1]
    stations[name] = {
        "id": row[1],
        "name": name,
        "trafic": float(row[4]),
        "lines": [],
        "rank": 0,
        "latitude": row[3],
        "longitude": row[2],
    }
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
    data["freq"][station["id"]] = {
        "name": name,
        "lines": station["lines"],
        "rank": trafic.index(station["trafic"]),
        "key": station["id"],
        "latitude": station["latitude"],
        "longitude": station["longitude"],
        "connexion": {},
        "trafic": station["trafic"]
    }

import json

json.dump(data, open("santiago.json", "w"), indent=2)


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
