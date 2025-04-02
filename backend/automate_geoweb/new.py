# import mercantile
# bounds = [-2.1917724609375, -6.130996814611723, -2.18353271484375, -6.137823951988504]
# tiles = list(mercantile.tiles(bounds[0], bounds[1], bounds[2], bounds[3], zooms=[6, 15]))
# print(tiles)

import mapbox_vector_tile
with open("/home/martin/tile.pbf", "rb") as f:
    data = f.read()
    decoded = mapbox_vector_tile.decode(data)
    print(decoded)