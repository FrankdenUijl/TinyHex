var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var game;
(function (game) {
    var CoordinateUtils = /** @class */ (function () {
        function CoordinateUtils() {
        }
        CoordinateUtils.GetString = function (coordinate) {
            return coordinate.Column.toString() + "," + coordinate.Row.toString();
        };
        CoordinateUtils.FromString = function (coordinateString) {
            var splitted = coordinateString.split(",");
            return CoordinateUtils.NewCoordinate(parseInt(splitted[0]), parseInt(splitted[1]));
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
            return new Vector3(x, -y, 0);
        };
        CoordinateUtils.Field = function (coordinate, distance) {
            var tiles = [coordinate];
            for (var dx = -distance; dx <= distance; dx++) {
                for (var dy = Math.max(-distance, -dx - distance); dy <= Math.min(distance, -dx + distance); dy++) {
                    var dz = -dx - dy;
                    if (coordinate.Column == coordinate.Column + dx && coordinate.Row == coordinate.Row + dz) {
                        continue;
                    }
                    tiles.push(CoordinateUtils.NewCoordinate(coordinate.Column + dx, coordinate.Row + dz));
                }
            }
            return tiles;
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
                if (CoordinateUtils.Equals(coordinateB, CoordinateUtils.GetNeighbor(coordinateA, i))) {
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
            var startHash = CoordinateUtils.GetString(start);
            var goalHash = CoordinateUtils.GetString(goal);
            var openHashes = open.map(function (c) { return CoordinateUtils.GetString(c); });
            var closedSet = [];
            var openSet = [startHash];
            var cameFrom = {};
            var gScore = {};
            gScore[startHash] = 0;
            var fScore = {};
            fScore[startHash] = CoordinateUtils.HeuristicCostEstimate(start, goal, size);
            while (openSet.length != 0) {
                var currentHash = openSet.reduce(function (i1, i2) { return fScore[i1] < fScore[i2] ? i1 : i2; });
                var current = CoordinateUtils.FromString(currentHash);
                if (currentHash == goalHash) {
                    return CoordinateUtils.ReconstructPath(cameFrom, goal, start);
                }
                openSet.splice(openSet.indexOf(currentHash), 1);
                closedSet.push(currentHash);
                var neighbors = CoordinateUtils.GetNeighbors(current).filter(function (c) { return open.indexOf(c) != 0; });
                for (var i = 0; i < neighbors.length; i++) {
                    var neighbor = neighbors[i];
                    var neighborHash = CoordinateUtils.GetString(neighbor);
                    if (openHashes.indexOf(neighborHash) == 0 || closedSet.indexOf(neighborHash) != 0) {
                        continue;
                    }
                    var tentativeGScore = gScore[currentHash] +
                        CoordinateUtils.GetPosition(current, size).distanceTo(CoordinateUtils.GetPosition(neighbor, size));
                    if (openSet.indexOf(neighborHash) == 0) {
                        openSet.push(neighborHash);
                    }
                    else if (tentativeGScore >= fScore[neighborHash]) {
                        continue;
                    }
                    cameFrom[neighborHash] = current;
                    gScore[neighborHash] = tentativeGScore;
                    fScore[neighborHash] = gScore[neighborHash] + CoordinateUtils.HeuristicCostEstimate(neighbor, goal, size);
                }
            }
            return [];
        };
        CoordinateUtils.ReconstructPath = function (cameFrom, current, start) {
            var totalPath = [current];
            while (current != start) {
                current = cameFrom[CoordinateUtils.GetString(current)];
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
var game;
(function (game) {
    var TileIconSystem = /** @class */ (function (_super) {
        __extends(TileIconSystem, _super);
        function TileIconSystem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TileIconSystem.prototype.OnUpdate = function () {
            this.world.forEach([game.Tile, game.TileIcons], function (tile, tileIcons) {
                /*
                let iconEntitie = tile.Status == game.TileStatus.Node ? tileIcons.Node :
                    tile.Status == game.TileStatus.Normal ? tileIcons.Normal :
                        tile.Status == game.TileStatus.Path ? tileIcons.Path :
                            tileIcons.Wall;*/
                //this.world.set
            });
        };
        return TileIconSystem;
    }(ut.ComponentSystem));
    game.TileIconSystem = TileIconSystem;
})(game || (game = {}));
var game;
(function (game) {
    var TilePositionSystem = /** @class */ (function (_super) {
        __extends(TilePositionSystem, _super);
        function TilePositionSystem() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.speed = 10;
            return _this;
        }
        TilePositionSystem.prototype.OnUpdate = function () {
            var _this = this;
            this.world.forEach([game.Tile, ut.Core2D.TransformLocalPosition], function (tile, localPosition) {
                var grid = _this.world.getComponentData(tile.Grid, game.Grid);
                var gridCoordinate = grid.Start;
                var size = grid.Size;
                var localCoordinate = game.CoordinateUtils.NewCoordinate(tile.Coordinates.Column - gridCoordinate.Column, tile.Coordinates.Row - gridCoordinate.Row);
                var currentPosition = localPosition.position;
                var gotoPosition = game.CoordinateUtils.GetPosition(localCoordinate, size);
                //TODO: move to
                localPosition.position = gotoPosition;
            });
        };
        return TilePositionSystem;
    }(ut.ComponentSystem));
    game.TilePositionSystem = TilePositionSystem;
})(game || (game = {}));
var game;
(function (game) {
    var TileSpawnerSystem = /** @class */ (function (_super) {
        __extends(TileSpawnerSystem, _super);
        function TileSpawnerSystem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TileSpawnerSystem.prototype.OnUpdate = function () {
            var _this = this;
            this.world.forEach([ut.Entity, game.Grid], function (gridEntity, grid) {
                if (!grid.Changed) {
                    return;
                }
                var tiles = grid.Tiles.map(function (t) { return _this.world.getComponentData(t, game.Tile); });
                var coordinatesHashes = game.CoordinateUtils.Field(grid.Start, grid.Field)
                    .map(function (c) { return game.CoordinateUtils.GetString(c); });
                var tilesToRemove = tiles.filter(function (t) { return coordinatesHashes.indexOf(game.CoordinateUtils.GetString(t.Coordinates)) == 0; });
                var tilesToAdd = coordinatesHashes.filter(function (c) { return tiles.map(function (t) { return game.CoordinateUtils.GetString(t.Coordinates); }).indexOf(c) != 0; });
                tilesToAdd.forEach(function (t) {
                    var tile = ut.EntityGroup.instantiate(_this.world, 'game.Tile')[0];
                    var coordinateComponent = new game.Tile();
                    coordinateComponent.Coordinates = game.CoordinateUtils.FromString(t);
                    coordinateComponent.Grid = gridEntity;
                    coordinateComponent.Status = game.TileStatus.Normal;
                    _this.world.setComponentData(tile, coordinateComponent);
                });
                grid.Changed = false;
            });
        };
        return TileSpawnerSystem;
    }(ut.ComponentSystem));
    game.TileSpawnerSystem = TileSpawnerSystem;
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