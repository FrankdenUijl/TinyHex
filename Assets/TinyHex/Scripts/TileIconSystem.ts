
namespace game
{
    export class TileIconSystem extends ut.ComponentSystem
    {
        
        public OnUpdate(): void
        {
            this.world.forEach([game.Tile, game.TileIcons],
                (tile, tileIcons) =>
                {
                    /*
                    let iconEntitie = tile.Status == game.TileStatus.Node ? tileIcons.Node :
                        tile.Status == game.TileStatus.Normal ? tileIcons.Normal :
                            tile.Status == game.TileStatus.Path ? tileIcons.Path :
                                tileIcons.Wall;*/

                    //this.world.set
                });
        }
    }
}
