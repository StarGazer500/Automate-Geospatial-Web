// async function fetchTileJSON() {
//   try {
//     const url = '/media/tiles/205/raster.cog.tif';
//     const response = await fetch(
//       `http://192.168.1.200:8001/cog/WebMercatorQuad/tilejson.json?url=${encodeURIComponent(url)}`,
//       {
//         method: 'GET',
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`TileJSON fetch failed with status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("TileJSON:", data);
//     return data;  // Use this in your map library
//   } catch (error) {
//     console.error("Fetch Error:", error);
//     return null;
//   }
// }

// fetchTileJSON();

const arr = ['a', 'b', 'c', 'd'];
console.log(arr.at(-2))