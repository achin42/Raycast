/**
 * Created by Infernus on 08/07/16.
 */

const VERTEX_ON_RAY_DIVERSION_COOFF = 100;

function LatLng(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Edge(x1, y1, x2, y2) {
    this.startX = x1;
    this.startY = y1;
    this.endX = x2;
    this.endY = y2;
}

function isLatLngInside(latlngs, latlng) {
    return normalizeLongitudesAndProceed(latlngs, latlng);
}

function isPointInside(points, point) {
    return isPointInsideEdges(getEdgesFromPoints(points), point)
}

module.exports = {
    LatLng: LatLng,
    Point: Point,
    Edge: Edge,

    isLatLngInside: isLatLngInside,
    isPointInside: isPointInside
}






function normalizeLongitudesAndProceed(latlngs, latlng) {
    if(latlngs.length < 3) {
        throw "At least 3 latlngs are required";
    }

    var smallestLongitude = Infinity;
    var highestLongitude = -Infinity;

    latlngs.forEach(function(l) {
        if(l.longitude < smallestLongitude) {
            smallestLongitude = l.longitude;
        } else if(l.longitude > highestLongitude) {
            highestLongitude = l.longitude;
        }
    });

    if(latlng.longitude < smallestLongitude) {
        smallestLongitude = latlng.longitude;
    } else if(latlng.longitude > highestLongitude) {
        highestLongitude = latlng.longitude;
    }

    if((highestLongitude - smallestLongitude) > 180) {
        var normalizedLatlngs = [];
        latlngs.forEach(function(l) {
            normalizedLatlngs.push(new LatLng(latlng.latitude, latlng.longitude < 0 ? latlng.longitude + 180 : latlng.longitude));
        });

        latlng = latlng = new LatLng(latlng.latitude, latlng.longitude < 0 ? latlng.longitude + 180 : latlng.longitude);

        return isPointInsideEdges(getEdgesFromLatLngs(normalizedLatlngs), getPointFromLatlng(latlng));
    } else {
        return isPointInsideEdges(getEdgesFromLatLngs(latlngs), getPointFromLatlng(latlng));
    }
}

function getEdgesFromLatLngs(latlngs) {
    var edges = [];

    for(var i = 0; i < latlngs.length; i++) {
        var l1 = latlngs[i];
        var l2 = i < latlngs.length - 1 ? latlngs[i+1] : latlngs[0];
        edges.push(new Edge(l1.latitude, l1.longitude, l2.latitude, l2.longitude));
    }

    return edges;
}

function getEdgesFromPoints(points) {
    var edges = [];

    for(var i = 0; i < points.length; i++) {
        var p1 = points[i];
        var p2 = i < points.length - 1 ? points[i+1] : points[0];
        edges.push(new Edge(p1.x, p1.y, p2.x, p2.y));
    }

    return edges;
}

function getPointFromLatlng(latlng) {
    return new Point(latlng.latitude, latlng.longitude);
}


function isPointInsideEdges(edges, point) {
    var intersectionCount = 0;

    var isPointOnAnEdge = false;
    edges.forEach(function(edge) {
        if(isPointOnLine(edge.startX, edge.startY, edge.endX, edge.endY, point)) isPointOnAnEdge = true;
        if(linesIntersect(edge.startX, edge.startY, edge.endX, edge.endY, point.x, point.y, Number.MAX_VALUE, Number.MAX_VALUE)) {
            if(isPointOnLine(point.x, point.y, Number.MAX_VALUE, Number.MAX_VALUE, new Point(edge.startX, edge.startY))
            || isPointOnLine(point.x, point.y, Number.MAX_VALUE, Number.MAX_VALUE, new Point(edge.endX, edge.endY))) {
                if(linesIntersect(edge.startX, edge.startY, edge.endX, edge.endY, point.x, point.y, Number.MAX_VALUE - VERTEX_ON_RAY_DIVERSION_COOFF, Number.MAX_VALUE - VERTEX_ON_RAY_DIVERSION_COOFF)) {
                    intersectionCount++;
                }
            } else {
                intersectionCount++;
            }
        }
    });

    if(isPointOnAnEdge) return true;

    return (intersectionCount % 2 != 0);
}




function isPointOnLine(ax, ay, bx, by, point) {
    var EPSILON = 0.0000001;
    var distance = dotLineLength(point.x, point.y, ax, ay, bx, by);
    return distance < EPSILON;
}

function dotLineLength(x, y, x0, y0, x1, y1) {
    var a = y0 - y1, b = x1 - x0, c = x0 * y1 - y0 * x1;
    return Math.abs(a * x + b * y + c) / Math.sqrt(a * a + b * b);
}



function linesIntersect(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;
    s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;
    s2_y = p3_y - p2_y;

    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        return 1;
    }

    return 0; // No collision
}