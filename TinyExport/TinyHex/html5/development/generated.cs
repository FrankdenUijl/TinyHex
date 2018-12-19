using UTiny;
using UTiny.Core2D;
using UTiny.Math;
using UTiny.Shared;
using ut;
using UTiny.HTML;
using UTiny.Rendering;
using ut.EditorExtensions;
using UTiny.Text;
using UTiny.UILayout;

/*
 * !!! TEMP UNITL PROPER SCENE FORMAT !!!
 */
namespace entities.game
{
    namespace Kickoff
    {
        public struct Component : IComponentData
        {
        }
    }
    namespace Tile
    {
        public struct Component : IComponentData
        {
        }
    }
}

namespace game
{
    public struct Grid : IComponentData
    {
        public int Field;
        public game.GridOrientation Orientation;
        public bool Changed;
        public Coordinate Start;
        public DynamicArray<Entity> Tiles;
        public int Size;
    }
    public struct Tile : IComponentData
    {
        public Coordinate Coordinates;
        public Entity Grid;
        public game.TileStatus Status;
    }
    public struct TileIcons : IComponentData
    {
        public Entity Normal;
        public Entity Wall;
        public Entity Path;
        public Entity Node;
    }
    public struct Coordinate
    {
        public int Row;
        public int Column;
    }
    public enum GridOrientation
    {
        FlatTopped = 0
        , PointyTopped = 1
    }
    public enum TileStatus
    {
        Normal = 0
        , Wall = 1
        , Path = 2
        , Node = 3
    }
}

namespace ut.Core2D
{
    namespace layers
    {
        public struct Default : IComponentData
        {
        }
        public struct TransparentFX : IComponentData
        {
        }
        public struct IgnoreRaycast : IComponentData
        {
        }
        public struct Water : IComponentData
        {
        }
        public struct UI : IComponentData
        {
        }
        public struct PostProcessing : IComponentData
        {
        }
        public struct Cutscene : IComponentData
        {
        }
    }
}

namespace ut.Math
{
}

namespace ut
{
}

namespace ut.Shared
{
}

namespace ut.Core2D
{
}

namespace ut
{
}

namespace ut.HTML
{
}

namespace ut.Rendering
{
}

namespace ut.Rendering
{
}

namespace ut.HTML
{
}

namespace ut.Core2D
{
}

namespace ut.Rendering
{
}

namespace ut.Rendering
{
}

namespace ut.Core2D
{
}

namespace ut.EditorExtensions
{
    public struct AssetReferenceAnimationClip : IComponentData
    {
        public string guid;
        public long fileId;
        public int type;
    }
    public struct AssetReferenceAudioClip : IComponentData
    {
        public string guid;
        public long fileId;
        public int type;
    }
    public struct AssetReferenceSprite : IComponentData
    {
        public string guid;
        public long fileId;
        public int type;
    }
    public struct AssetReferenceSpriteAtlas : IComponentData
    {
        public string guid;
        public long fileId;
        public int type;
    }
    public struct AssetReferenceTexture2D : IComponentData
    {
        public string guid;
        public long fileId;
        public int type;
    }
    public struct AssetReferenceTile : IComponentData
    {
        public string guid;
        public long fileId;
        public int type;
    }
    public struct AssetReferenceTMP_FontAsset : IComponentData
    {
        public string guid;
        public long fileId;
        public int type;
    }
    public struct CameraCullingMask : IComponentData
    {
        public int mask;
    }
    public struct EntityLayer : IComponentData
    {
        public int layer;
    }
}

namespace ut.Text
{
}

namespace ut.HTML
{
}

namespace ut.UILayout
{
}
namespace game
{
    public class TileIconSystemJS : IComponentSystem
    {
    }
}
namespace game
{
    public class TilePositionSystemJS : IComponentSystem
    {
    }
}
namespace game
{
    public class TileSpawnerSystemJS : IComponentSystem
    {
    }
}
