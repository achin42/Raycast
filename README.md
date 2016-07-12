[![NPM](https://nodei.co/npm/raycast.svg?downloads=true&downloadRank=true)](https://nodei.co/npm/raycast/)&nbsp;&nbsp;


# Raycast
Raycast algorithm helps you determine if a point lies inside a polygon. Edge cases involved in working with LatLngs have been handled. The package also provides LatLng and Point classes to support following two methods
 

1. isLatLntInside([LatLng], LatLng);
2. isPointInside([Point], Point);
 
 
Example usage
-------------
 
 ```javascript
 var latlngs = [];
 latlngs.push(new LatLng(28.635789, 77.215029));
 latlngs.push(new LatLng(28.638086, 77.220952));
 latlngs.push(new LatLng(28.634621, 77.225758));
 latlngs.push(new LatLng(28.634771, 77.221467));
 latlngs.push(new LatLng(28.632662, 77.225114));
 latlngs.push(new LatLng(28.629724, 77.220265));
 latlngs.push(new LatLng(28.631796, 77.215265));
 
 var latlng = new LatLng(28.632869, 77.219466);
 
 var isLatLngInside = raycast.isLatLngInside(latlngs, latlng); 
 ```

See this blogpost for further explanation [GitHub]()