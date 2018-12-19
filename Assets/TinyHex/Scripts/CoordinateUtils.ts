
namespace game 
{
    export class CoordinateUtils
    {
        public static Neighbors: Coordinate[] = [
            CoordinateUtils.NewCoordinate(1, 0),
            CoordinateUtils.NewCoordinate(1, -1),
            CoordinateUtils.NewCoordinate(0, -1),
            CoordinateUtils.NewCoordinate(-1, 0),
            CoordinateUtils.NewCoordinate(-1, 1),
            CoordinateUtils.NewCoordinate(0, 1),
        ];

        public static GetString(coordinate: Coordinate): string
        {
            return coordinate.Column.toString() + "," + coordinate.Row.toString();
        }

        public static FromString(coordinateString: string): Coordinate
        {
            let splitted = coordinateString.split(",");
            return CoordinateUtils.NewCoordinate(parseInt(splitted[0]), parseInt(splitted[1]));
        }

        public static Equals(coordinateA: Coordinate, coordinateB: Coordinate): boolean
        {
            return coordinateA.Row == coordinateB.Row &&
                coordinateA.Column == coordinateB.Column;
        }
        
        public static NewCoordinate(column: number, row: number): Coordinate 
        {
            let coordinate = new Coordinate();
            coordinate.Row = row;
            coordinate.Column = column;
            return coordinate;
        }

        public static GetPosition(coordinate: Coordinate, size: number): Vector3 
        {
            let x:number = size * 3 / 2 * coordinate.Column;
            let y:number = size * Math.sqrt(3) * (coordinate.Row + coordinate.Column / 2);
            return new Vector3(x, -y, 0);
        }

        public static Field(coordinate: Coordinate, distance:number): Coordinate[]
        {
            let tiles: Coordinate[] = [coordinate];
            for (let dx:number = -distance; dx <= distance; dx++)
            {
                for (let dy:number = Math.max(-distance, -dx - distance); dy <= Math.min(distance, -dx + distance); dy++)
                {
                    let dz: number = -dx - dy;

                    if (coordinate.Column == coordinate.Column + dx && coordinate.Row == coordinate.Row + dz)
                    {
                        continue;
                    }
                    
                    tiles.push(CoordinateUtils.NewCoordinate(coordinate.Column + dx, coordinate.Row + dz));
                }
            }

            return tiles;
        }

        public static GetNeighbors(coordinate: Coordinate): Coordinate[]
        {
            return [
                CoordinateUtils.GetNeighbor(coordinate, 0),
                CoordinateUtils.GetNeighbor(coordinate, 1),
                CoordinateUtils.GetNeighbor(coordinate, 2),
                CoordinateUtils.GetNeighbor(coordinate, 3),
                CoordinateUtils.GetNeighbor(coordinate, 4),
                CoordinateUtils.GetNeighbor(coordinate, 5)
            ]
        }

        public static IsNeighbor(coordinateA: Coordinate, coordinateB: Coordinate): boolean
        {
            for (let i = 0; i < CoordinateUtils.Neighbors.length; i += 1)
            {
                if (CoordinateUtils.Equals(coordinateB, CoordinateUtils.GetNeighbor(coordinateA, i)))
                {
                    return true;
                }
            }

            return false;
        }

        public static GetNeighbor(coordinate: Coordinate, directionIndex: number): Coordinate
        {
            return CoordinateUtils.NewCoordinate(coordinate.Column + CoordinateUtils.Neighbors[directionIndex].Column, 
                coordinate.Row + CoordinateUtils.Neighbors[directionIndex].Row);
        }

        private static HeuristicCostEstimate(coordinateA: Coordinate, coordinateB:Coordinate, size:number): number
        {
            return CoordinateUtils.GetPosition(coordinateA, size)
                .distanceTo(CoordinateUtils.GetPosition(coordinateB, size));
        }

        public static APathFinding(start: Coordinate,
            goal: Coordinate,
            open: Coordinate[],
            size: number): Coordinate[]
        {
            let startHash: string = CoordinateUtils.GetString(start);
            let goalHash: string = CoordinateUtils.GetString(goal);
            let openHashes: string[] = open.map(c => CoordinateUtils.GetString(c));

            let closedSet: string[] = [];
            let openSet: string[] = [ startHash ];
            let cameFrom: { [key: string] : Coordinate; } = {};

            let gScore: { [key: string]: number; } = {};
            gScore[startHash] = 0;
            let fScore: { [key: string]: number; } = {};
            fScore[startHash] = CoordinateUtils.HeuristicCostEstimate(start, goal, size);

            while (openSet.length != 0) 
            {
                let currentHash: string = openSet.reduce((i1, i2) => fScore[i1] < fScore[i2] ? i1 : i2);
                let current: Coordinate = CoordinateUtils.FromString(currentHash);

                if (currentHash == goalHash)
                {
                    return CoordinateUtils.ReconstructPath(cameFrom, goal, start);
                }

                openSet.splice(openSet.indexOf(currentHash), 1);
                closedSet.push(currentHash);

                let neighbors: Coordinate[] = CoordinateUtils.GetNeighbors(current).filter(c => open.indexOf(c) != 0);

                for (let i = 0; i < neighbors.length; i++) 
                {
                    let neighbor: Coordinate = neighbors[i];
                    let neighborHash: string = CoordinateUtils.GetString(neighbor);

                    if (openHashes.indexOf(neighborHash) == 0 || closedSet.indexOf(neighborHash) != 0)
                    {
                        continue;
                    }

                    let tentativeGScore: number = gScore[currentHash] + 
                        CoordinateUtils.GetPosition(current, size).distanceTo(CoordinateUtils.GetPosition(neighbor, size));

                    if (openSet.indexOf(neighborHash) == 0)
                    {
                        openSet.push(neighborHash);
                    }
                    else if (tentativeGScore >= fScore[neighborHash])
                    {
                        continue;
                    }

                    cameFrom[neighborHash] = current;
                    gScore[neighborHash] = tentativeGScore;
                    fScore[neighborHash] = gScore[neighborHash] + CoordinateUtils.HeuristicCostEstimate(neighbor, goal, size);
                }
            }

            return [];
        }

        private static ReconstructPath(cameFrom: { [key: string] : Coordinate; }, current: Coordinate, start: Coordinate): Coordinate[]
        {
            let totalPath: Coordinate[] = [ current ];
            while (current != start)
            {
                current = cameFrom[CoordinateUtils.GetString(current)];
                totalPath.push(current);
            }

            return totalPath.reverse();
        }
    }
}
