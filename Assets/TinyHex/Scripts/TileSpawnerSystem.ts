
namespace game
{
    export class TileSpawnerSystem extends ut.ComponentSystem
    {
        public OnUpdate(): void
        {
            this.world.forEach([ut.Entity, game.Grid],
                (gridEntity, grid) =>
                {
                    if (!grid.Changed)
                    {
                        return;
                    }

                    let tiles: game.Tile[] = grid.Tiles.map(t => this.world.getComponentData(t, game.Tile));
                    let coordinatesHashes: string[] = CoordinateUtils.Field(grid.Start, grid.Field)
                        .map(c => CoordinateUtils.GetString(c));

                    let tilesToRemove: Tile[] = tiles.filter(t => coordinatesHashes.indexOf(CoordinateUtils.GetString(t.Coordinates)) == 0);
                    let tilesToAdd: string[] = coordinatesHashes.filter(c => tiles.map(t => CoordinateUtils.GetString(t.Coordinates)).indexOf(c) != 0);

                    tilesToAdd.forEach(t => {
                        let tile: ut.Entity = ut.EntityGroup.instantiate(this.world, 'game.Tile')[0];

                        let coordinateComponent = new game.Tile();
                        coordinateComponent.Coordinates = CoordinateUtils.FromString(t);
                        coordinateComponent.Grid = gridEntity;
                        coordinateComponent.Status = game.TileStatus.Normal;

                        this.world.setComponentData(tile, coordinateComponent);
                    });
                    

                    grid.Changed = false;
                });
        }
    }
}
