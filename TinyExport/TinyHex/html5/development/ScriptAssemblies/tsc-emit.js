var game;
(function (game) {
    var CoordinateUtils = /** @class */ (function () {
        function CoordinateUtils() {
        }
        CoordinateUtils.GetHashCode = function (coordinate) {
            var hash = coordinate.Column;
            hash = (hash << 16) | coordinate.Row;
            return hash;
        };
        CoordinateUtils.GetCoordinateFromHash = function (hash) {
            var row = hash & 0xffff;
            var column = (hash >> 16) & 0xffff;
            return CoordinateUtils.NewCoordinate(row, column);
        };
        CoordinateUtils.Equals = function (coordinateA, coordinateB) {
            return coordinateA.Row == coordinateB.Row &&
                coordinateA.Column == coordinateB.Column;
        };
        CoordinateUtils.NewCoordinate = function (column, row) {
            var coordinate = new game.Coordinate();
            coordinate.Row = row;
            coordinate.Column = column;
            return coordinate;
        };
        CoordinateUtils.GetPosition = function (coordinate, size) {
            var x = size * 3 / 2 * coordinate.Column;
            var y = size * Math.sqrt(3) * (coordinate.Row + coordinate.Column / 2);
            return new Vector3(x, 0, -y);
        };
        CoordinateUtils.GetNeighbors = function (coordinate) {
            return [
                CoordinateUtils.GetNeighbor(coordinate, 0),
                CoordinateUtils.GetNeighbor(coordinate, 1),
                CoordinateUtils.GetNeighbor(coordinate, 2),
                CoordinateUtils.GetNeighbor(coordinate, 3),
                CoordinateUtils.GetNeighbor(coordinate, 4),
                CoordinateUtils.GetNeighbor(coordinate, 5)
            ];
        };
        CoordinateUtils.IsNeighbor = function (coordinateA, coordinateB) {
            for (var i = 0; i < CoordinateUtils.Neighbors.length; i += 1) {
                if (coordinateB == CoordinateUtils.GetNeighbor(coordinateA, i)) {
                    return true;
                }
            }
            return false;
        };
        CoordinateUtils.GetNeighbor = function (coordinate, directionIndex) {
            return CoordinateUtils.NewCoordinate(coordinate.Column + CoordinateUtils.Neighbors[directionIndex].Column, coordinate.Row + CoordinateUtils.Neighbors[directionIndex].Row);
        };
        CoordinateUtils.HeuristicCostEstimate = function (coordinateA, coordinateB, size) {
            return CoordinateUtils.GetPosition(coordinateA, size)
                .distanceTo(CoordinateUtils.GetPosition(coordinateB, size));
        };
        CoordinateUtils.APathFinding = function (start, goal, open, size) {
            var closedSet = [];
            var openSet = [start];
            var cameFrom = {};
            var gScore = {};
            gScore[CoordinateUtils.GetHashCode(start)] = 0;
            var fScore = {};
            fScore[CoordinateUtils.GetHashCode(start)] = CoordinateUtils.HeuristicCostEstimate(start, goal, size);
            while (openSet.length != 0) {
                var current = openSet.reduce(function (i1, i2) { return fScore[CoordinateUtils.GetHashCode(i1)] < fScore[CoordinateUtils.GetHashCode(i2)] ? i1 : i2; });
                if (current == goal) {
                    return CoordinateUtils.ReconstructPath(cameFrom, goal, start);
                }
                openSet.splice(openSet.indexOf(current), 1);
                closedSet.push(current);
                var neighbors = CoordinateUtils.GetNeighbors(current).filter(function (c) { return open.indexOf(c) != 0; });
                for (var i = 0; i < neighbors.length; i++) {
                    var neighbor = neighbors[i];
                    var neighborHashCode = CoordinateUtils.GetHashCode(neighbor);
                    if (open.indexOf(neighbor) == 0 || closedSet.indexOf(neighbor) != 0) {
                        continue;
                    }
                    var tentativeGScore = gScore[CoordinateUtils.GetHashCode(current)] +
                        CoordinateUtils.GetPosition(current, size).distanceTo(CoordinateUtils.GetPosition(neighbor, size));
                    if (openSet.indexOf(neighbor) == 0) {
                        openSet.push(neighbor);
                    }
                    else if (tentativeGScore >= fScore[neighborHashCode]) {
                        continue;
                    }
                    cameFrom[neighborHashCode] = current;
                    gScore[neighborHashCode] = tentativeGScore;
                    fScore[neighborHashCode] = gScore[neighborHashCode] + CoordinateUtils.HeuristicCostEstimate(neighbor, goal, size);
                }
            }
            return [];
        };
        CoordinateUtils.ReconstructPath = function (cameFrom, current, start) {
            var totalPath = [current];
            while (current != start) {
                current = cameFrom[CoordinateUtils.GetHashCode(current)];
                totalPath.push(current);
            }
            return totalPath.reverse();
        };
        CoordinateUtils.Neighbors = [
            CoordinateUtils.NewCoordinate(1, 0),
            CoordinateUtils.NewCoordinate(1, -1),
            CoordinateUtils.NewCoordinate(0, -1),
            CoordinateUtils.NewCoordinate(-1, 0),
            CoordinateUtils.NewCoordinate(-1, 1),
            CoordinateUtils.NewCoordinate(0, 1),
        ];
        return CoordinateUtils;
    }());
    game.CoordinateUtils = CoordinateUtils;
})(game || (game = {}));
var ut;
(function (ut) {
    var EntityGroup = /** @class */ (function () {
        function EntityGroup() {
        }
        /**
         * @method
         * @desc Creates a new instance of the given entity group by name and returns all entities
         * @param {ut.World} world - The world to add to
         * @param {string} name - The fully qualified name of the entity group
         * @returns Flat list of all created entities
         */
        EntityGroup.instantiate = function (world, name) {
            var data = this.getEntityGroupData(name);
            if (data == undefined)
                throw "ut.EntityGroup.instantiate: No 'EntityGroup' was found with the name '" + name + "'";
            return data.load(world);
        };
        ;
        /**
         * @method
         * @desc Destroys all entities that were instantated with the given group name
         * @param {ut.World} world - The world to destroy from
         * @param {string} name - The fully qualified name of the entity group
         */
        EntityGroup.destroyAll = function (world, name) {
            var type = this.getEntityGroupData(name).Component;
            world.forEach([ut.Entity, type], function (entity, instance) {
                // @TODO This should REALLY not be necessary
                // We are protecting against duplicate calls to `destroyAllEntityGroups` within an iteration
                if (world.exists(entity)) {
                    world.destroyEntity(entity);
                }
            });
        };
        /**
         * @method
         * @desc Returns an entity group object by name
         * @param {string} name - Fully qualified group name
         */
        EntityGroup.getEntityGroupData = function (name) {
            var parts = name.split('.');
            if (parts.length < 2)
                throw "ut.Streaming.StreamingService.getEntityGroupData: name entry is invalid";
            var shiftedParts = parts.shift();
            var initialData = entities[shiftedParts];
            if (initialData == undefined)
                throw "ut.Streaming.StreamingService.getEntityGroupData: name entry is invalid";
            return parts.reduce(function (v, p) {
                return v[p];
            }, initialData);
        };
        return EntityGroup;
    }());
    ut.EntityGroup = EntityGroup;
})(ut || (ut = {}));
var ut;
(function (ut) {
    var EntityLookupCache = /** @class */ (function () {
        function EntityLookupCache() {
        }
        EntityLookupCache.getByName = function (world, name) {
            var entity;
            if (name in this._cache) {
                entity = this._cache[name];
                if (world.exists(entity))
                    return entity;
            }
            entity = world.getEntityByName(name);
            this._cache[name] = entity;
            return entity;
        };
        EntityLookupCache._cache = {};
        return EntityLookupCache;
    }());
    ut.EntityLookupCache = EntityLookupCache;
})(ut || (ut = {}));
//# sourceMappingURL=tsc-emit.js.map