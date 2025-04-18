import { useState } from 'react';
import styled from 'styled-components';
import { TypedEmitter } from 'tiny-typed-emitter';
import { Tile } from '../entities/Tile';
import { extractTiles, TileExtractionProgressEvents } from '../utils/extractTiles';
import Panel from './Panel';
import TileSet from './TileSet';

const TilesPanelStyled = styled(Panel)`
  background-color: lightyellow;
  display: flex;
  flex-direction: column;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  display: inline-block;
  margin-right: 10px;
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
    {tiles.map((tile, index) => (
      <div key={index}>
        <div>Tile {index}</div>
        <StyledLabel>Top:</StyledLabel>
        <StyledTile src={tile.url} />
        <TileSet tiles={tile.topNeighbors} />
        <br />
        <StyledLabel>Right:</StyledLabel>
        <StyledTile src={tile.url} />
        <TileSet tiles={tile.rightNeighbors} />
        <br />
        <StyledLabel>Bottom:</StyledLabel>
        <StyledTile src={tile.url} />
        <TileSet tiles={tile.bottomNeighbors} />
        <br />
        <StyledLabel>Left:</StyledLabel>
        <StyledTile src={tile.url} />
        <TileSet tiles={tile.leftNeighbors} />
      </div>
    ))}
  </>
);

export function TilesPanel({ imageData, onTilesExtracted }: TilesPanelProps) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loop, setLoop] = useState(true);
  const [includeFlipped, setIncludeFlipped] = useState(true);
  const [includeRotated, setIncludeRotated] = useState(true);
  const [extractionStatus, setExtractionStatus] = useState<string | null>(null);
  const [debugMode] = useState(false);

  const handleExtractTiles = () => {
    if (!imageData) {
      return;
    }

    void (async () => {
      try {
        const eventEmitter = new TypedEmitter<TileExtractionProgressEvents>();
        eventEmitter.on('rowProcessed', ({ row, totalTiles }) => {
          setExtractionStatus(`Row ${row} processed. Total tiles: ${totalTiles}`);
        });
        eventEmitter.on('tileProcessed', ({ tileIndex, totalTiles }) => {
          setExtractionStatus(`Tile ${tileIndex} processed. Total tiles: ${totalTiles}`);
        });

        const extractedTiles = await extractTiles(
          imageData,
          { tileSize: 3, loop, includeFlipped, includeRotated },
          eventEmitter,
        );
        setTiles(extractedTiles);
        onTilesExtracted(extractedTiles);
        setExtractionStatus(
          `Extraction completed. Total tiles extracted: ${extractedTiles.length}`,
        );
      } catch (error) {
        console.error('Error extracting tiles:', error);
        setExtractionStatus('Error extracting tiles. Please check the console for details.');
      }
    })();
  };

  return (
    <TilesPanelStyled>
      <h2>2. Extract tiles</h2>
      <label>
        <input
          type="checkbox"
          checked={loop}
          onChange={e => {
            setLoop(e.target.checked);
          }}
        />
        Loop
      </label>
      <label>
        <input
          type="checkbox"
          checked={includeFlipped}
          onChange={e => {
            setIncludeFlipped(e.target.checked);
          }}
        />
        Include Flipped
      </label>
      <label>
        <input
          type="checkbox"
          checked={includeRotated}
          onChange={e => {
            setIncludeRotated(e.target.checked);
          }}
        />
        Include Rotated
      </label>
      <button onClick={handleExtractTiles}>Extract Tiles</button>
      <div>
        <StyledLabel>Extraction status:</StyledLabel>
        {extractionStatus}
      </div>
      <ScrollableTileSet>
        <TileSet tiles={tiles} />
      </ScrollableTileSet>
      {debugMode && <TilesDebug tiles={tiles} />}
    </TilesPanelStyled>
  );
}
