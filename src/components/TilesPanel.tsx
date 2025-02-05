import styled from 'styled-components';
import { Tile } from '../entities/Tile';
import Panel from './Panel';
import TileSet from './TileSet';

const TilesPanelStyled = styled(Panel)`
  background-color: lightyellow;
  display: flex;
  flex-direction: column;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  width: 80px;
  display: inline-block;
`;

const StyledTile = styled.img`
  width: 28px;
  margin-right: 5px;
  object-fit: contain;
  image-rendering: pixelated;
  border: 1px dashed black;
`;

const ScrollableTileSet = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

interface TilesPanelProps {
  tiles: Tile[];
}

const TilesDebug = ({ tiles }: TilesPanelProps) => (
  <>
    <br />
    {
      tiles.map((tile, index) => (
        <div key={index}>
          <div>Tile {index}</div>
          <StyledLabel>Top:</StyledLabel><StyledTile src={tile.url} /><TileSet tiles={tile.topNeighbors} /><br />
          <StyledLabel>Right:</StyledLabel><StyledTile src={tile.url} /><TileSet tiles={tile.rightNeighbors} /><br />
          <StyledLabel>Bottom:</StyledLabel><StyledTile src={tile.url} /><TileSet tiles={tile.bottomNeighbors} /><br />
          <StyledLabel>Left:</StyledLabel><StyledTile src={tile.url} /><TileSet tiles={tile.leftNeighbors} />
        </div>
      ))
    }
  </>
);

export function TilesPanel({ tiles }: TilesPanelProps) {
  return (
    <TilesPanelStyled>
      <h2>Tiles ({tiles.length})</h2>
      <ScrollableTileSet>
        <TileSet tiles={tiles} />
      </ScrollableTileSet>
      {false && <TilesDebug tiles={tiles} />}
    </TilesPanelStyled>
  )
}
