import styled from 'styled-components';
import { Tile } from '../entities/Tile';
import Panel from './Panel';
import TileSet from './TileSet';

const TilesPanelStyled = styled(Panel)`
  background-color: lightyellow;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  width: 80px;
  display: inline-block;
`;

interface TilesPanelProps {
  tiles: Tile[];
}

const TilesDebug = ({ tiles }: TilesPanelProps) => (
  <>
    {
      tiles.map((tile, index) => (
        <div key={index}>
          <div>Tile {index}</div>
          <StyledLabel>Top:</StyledLabel><TileSet tiles={[tile, ...tile.topNeighbors]} /><br />
          <StyledLabel>Right:</StyledLabel><TileSet tiles={[tile, ...tile.rightNeighbors]} /><br />
          <StyledLabel>Bottom:</StyledLabel><TileSet tiles={[tile, ...tile.bottomNeighbors]} /><br />
          <StyledLabel>Left:</StyledLabel><TileSet tiles={[tile, ...tile.leftNeighbors]} />
        </div>
      ))
    }
  </>
);

export function TilesPanel({ tiles }: TilesPanelProps) {
  return (
    <TilesPanelStyled>
      <h2>Tiles</h2>
      <TileSet tiles={tiles} />
      <br />
      {/* <TilesDebug tiles={tiles} /> */}
    </TilesPanelStyled>
  )
}
