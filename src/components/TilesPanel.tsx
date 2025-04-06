import { useState } from 'react';
import styled from 'styled-components';
import { Tile } from '../entities/Tile';
import { extractTiles } from '../utils/extractTiles';
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
  margin: 10px 0 0;
`;

interface TilesPanelProps {
  imageData: ImageData | null;
  onTilesExtracted: (tiles: Tile[]) => void;
}

const TilesDebug = ({ tiles }: { tiles: Tile[] }) => (
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

export function TilesPanel({ imageData, onTilesExtracted }: TilesPanelProps) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loop, setLoop] = useState(true);
  const [includeFlipped, setIncludeFlipped] = useState(true);
  const [includeRotated, setIncludeRotated] = useState(true);

  const handleExtractTiles = () => {
    if (imageData) {
      const extractedTiles = extractTiles(imageData, { tileSize: 3, loop, includeFlipped, includeRotated });
      setTiles(extractedTiles);
      onTilesExtracted(extractedTiles);
    }
  };

  return (
    <TilesPanelStyled>
      <h2>2. Extract tiles</h2>
      <label>
        <input
          type="checkbox"
          checked={loop}
          onChange={(e) => setLoop(e.target.checked)}
        />
        Loop
      </label>
      <label>
        <input
          type="checkbox"
          checked={includeFlipped}
          onChange={(e) => setIncludeFlipped(e.target.checked)}
        />
        Include Flipped
      </label>
      <label>
        <input
          type="checkbox"
          checked={includeRotated}
          onChange={(e) => setIncludeRotated(e.target.checked)}
        />
        Include Rotated
      </label>
      <button onClick={handleExtractTiles}>Extract Tiles</button>
      <div>
        <StyledLabel>Tile count:</StyledLabel>
        {tiles.length}
      </div>
      <ScrollableTileSet>
        <TileSet tiles={tiles} />
      </ScrollableTileSet>
      {false && <TilesDebug tiles={tiles} />}
    </TilesPanelStyled>
  );
}
