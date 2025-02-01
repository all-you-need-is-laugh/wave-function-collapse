import styled from 'styled-components';
import { Tile } from '../utils/interfaces';
import Panel from './Panel';
import TileSet from './TileSet';

const TilesPanelStyled = styled(Panel)`
  background-color: lightyellow;
`;

interface TilesPanelProps {
  tiles: Tile[];
}

export function TilesPanel({ tiles }: TilesPanelProps) {
  return (
    <TilesPanelStyled>
      <h2>Tiles</h2>
      <TileSet tiles={tiles} />
    </TilesPanelStyled>
  )
}
