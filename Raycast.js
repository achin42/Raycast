/**
 * Created by Infernus on 08/07/16.
 */

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
    normalizeLongitudesAndProceed(latlngs, latlng);
}

function isPointInside(points, point) {
    isPointInsideEdges(getEdgesFromPoints(points), point)
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

    edges.forEach(function(edge) {
        if(linesIntersect(edge.startX, edge.startY, edge.endX, edge.endY, point.x, point.y, Number.MAX_VALUE, Number.MAX_VALUE)) {
            intersectionCount++;
        }
    });

    return (intersectionCount % 2 != 0);
}



function linesIntersect(X1, Y1, X2, Y2, X3, Y3, X4, Y4) {
    return ((relativeCCW(X1, Y1, X2, Y2, X3, Y3)
    * relativeCCW(X1, Y1, X2, Y2, X4, Y4) <= 0) && (relativeCCW(X3,
        Y3, X4, Y4, X1, Y1)
    * relativeCCW(X3, Y3, X4, Y4, X2, Y2) <= 0));
}

function relativeCCW(X1, Y1, X2, Y2, PX, PY) {
    X2 -= X1;
    Y2 -= Y1;
    PX -= X1;
    PY -= Y1;
    var ccw = PX * Y2 - PY * X2;
    if (ccw == 0) {
        // The point is colinear, classify based on which side of
        // the segment the point falls on. We can calculate a
        // relative value using the projection of PX,PY onto the
        // segment - a negative value indicates the point projects
        // outside of the segment in the direction of the particular
        // endpoint used as the origin for the projection.
        ccw = PX * X2 + PY * Y2;
        if (ccw > 0) {
            // Reverse the projection to be relative to the original X2,Y2
            // X2 and Y2 are simply negated.
            // PX and PY need to have (X2 - X1) or (Y2 - Y1) subtracted
            // from them (based on the original values)
            // Since we really want to get a positive answer when the
            // point is "beyond (X2,Y2)", then we want to calculate
            // the inverse anyway - thus we leave X2 & Y2 negated.
            PX -= X2;
            PY -= Y2;
            ccw = PX * X2 + PY * Y2;
            if (ccw < 0) {
                ccw = 0;
            }
        }
    }
    return (ccw < 0) ? -1 : ((ccw > 0) ? 1 : 0);
}