
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

        public static GetHashCode(coordinate: Coordinate): number
        {
            let hash: number = coordinate.Column;
            hash = (hash << 16) | coordinate.Row;
            return hash;
        }

        public static GetCoordinateFromHash(hash: number): Coordinate
        {
            let row = hash & 0xffff;
            let column = (hash >> 16) & 0xffff;
            return CoordinateUtils.NewCoordinate(row, column);
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
            return new Vector3(x, 0, -y);
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
                if (coordinateB == CoordinateUtils.GetNeighbor(coordinateA, i))
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
            let closedSet: Coordinate[] = [];
            let openSet:Coordinate[] = [ start ];
            let cameFrom: { [key: number] : Coordinate; } = {};

            let gScore: { [key: number] : number; } = {};
            gScore[CoordinateUtils.GetHashCode(start)] = 0;
            let fScore: { [key: number] : number; } = {};
            fScore[CoordinateUtils.GetHashCode(start)] = CoordinateUtils.HeuristicCostEstimate(start, goal, size);

            while (openSet.length != 0) 
            {
                let current:Coordinate = openSet.reduce((i1, i2) => fScore[CoordinateUtils.GetHashCode(i1)] < fScore[CoordinateUtils.GetHashCode(i2)] ? i1 : i2);
                if (current == goal)
                {
                    return CoordinateUtils.ReconstructPath(cameFrom, goal, start);
                }

                openSet.splice(openSet.indexOf(current), 1);
                closedSet.push(current);

                let neighbors: Coordinate[] = CoordinateUtils.GetNeighbors(current).filter(c => open.indexOf(c) != 0);

                for (let i = 0; i < neighbors.length; i++) 
                {
                    let neighbor = neighbors[i];
                    let neighborHashCode = CoordinateUtils.GetHashCode(neighbor);

                    if (open.indexOf(neighbor) == 0 || closedSet.indexOf(neighbor) != 0)
                    {
                        continue;
                    }

                    let tentativeGScore:number = gScore[CoordinateUtils.GetHashCode(current)] + 
                        CoordinateUtils.GetPosition(current, size).distanceTo(CoordinateUtils.GetPosition(neighbor, size));

                    if (openSet.indexOf(neighbor) == 0)
                    {
                        openSet.push(neighbor);
                    }
                    else if (tentativeGScore >= fScore[neighborHashCode])
                    {
                        continue;
                    }

                    cameFrom[neighborHashCode] = current;
                    gScore[neighborHashCode] = tentativeGScore;
                    fScore[neighborHashCode] = gScore[neighborHashCode] + CoordinateUtils.HeuristicCostEstimate(neighbor, goal, size);
                }
            }

            return [];
        }

        private static ReconstructPath(cameFrom: { [key: number] : Coordinate; }, current: Coordinate, start: Coordinate): Coordinate[]
        {
            let totalPath: Coordinate[] = [ current ];
            while (current != start)
            {
                current = cameFrom[CoordinateUtils.GetHashCode(current)];
                totalPath.push(current);
            }

            return totalPath.reverse();
        }
    }
}
