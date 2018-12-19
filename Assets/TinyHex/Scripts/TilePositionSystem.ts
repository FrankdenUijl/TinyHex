
namespace game
{
    export class TilePositionSystem extends ut.ComponentSystem
    {
        private speed: number = 10;

        public OnUpdate(): void
        {
            this.world.forEach([game.Tile, ut.Core2D.TransformLocalPosition],
                (tile, localPosition) =>
                {
                    let grid: game.Grid = this.world.getComponentData(tile.Grid, game.Grid);
                    let gridCoordinate: Coordinate = grid.Start;
                    let size: number = grid.Size;

                    let localCoordinate: game.Coordinate = CoordinateUtils.NewCoordinate(tile.Coordinates.Column - gridCoordinate.Column,
                        tile.Coordinates.Row - gridCoordinate.Row);

                    let currentPosition: Vector3 = localPosition.position;
                    let gotoPosition: Vector3 = CoordinateUtils.GetPosition(localCoordinate, size);

                    //TODO: move to
                    localPosition.position = gotoPosition;
                });
        }
    }
}
