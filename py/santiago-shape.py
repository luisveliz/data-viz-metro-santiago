import shpUtils
import re
shpRecords = shpUtils.loadShapefile('santiago/cl_13comunas_geo.shp')

all_coords = []

for i in range(0, len(shpRecords)):
    coords = []
    name = re.sub("[^\w\s]", "",
                  shpRecords[i]['dbf_data']["NOMBRE"].lower().strip())
    if name in ("san jose de maipo", "lo barnechea", "curacavi", "melipilla",
                "maria pinto", "pirque", "buin", "el monte", "talagante",
                "lampa", "colina", "peaflor"):
        print(name)
    else:
        print(name)
        for j in range(0,
                       len(shpRecords[i]['shp_data']['parts'][0]['points'])):
            tempx = float(
                shpRecords[i]['shp_data']['parts'][0]['points'][j]['x'])
            tempy = float(
                shpRecords[i]['shp_data']['parts'][0]['points'][j]['y'])
            coords.append((tempx, tempy))

        coords = ["[%s, %s]" % row for row in coords]
        coords = ',\n  '.join(coords)
        all_coords.append("{'name':'" + name + "','coords':[" + coords + "]}")

all_coords = ',\n'.join(all_coords)


santiago = open("santiago.js", "w")
content = "var santiago = [" + all_coords + "];"
santiago.write(content)
