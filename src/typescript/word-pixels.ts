import { Vector } from './vector';

const BOX_PADDING = 20;

const SEED_GRID_SIZE = 16;


export function generatePixelGrid(phrase: string, maxWidth: number, maxHeight: number): Vector[] {
  let words = phrase.split(/\s+/);
  let wordHeight = Math.floor(maxHeight / words.length);

  let widths = words.map(word => {
    return measureWord(word, wordHeight);
  });

  let maxMeasuredWidth = Math.max(...widths);
  let maxPaddedWidth = maxWidth - (2 * BOX_PADDING);
  if (maxPaddedWidth < maxMeasuredWidth) {
    let scaleFactor = maxPaddedWidth / maxMeasuredWidth;
    wordHeight = Math.floor(wordHeight * scaleFactor);
    widths = widths.map((width: number) => {
      return Math.floor(width * scaleFactor);
    });

  }

  let pixelGrids: boolean[][] = [];
  for (let i = 0, word: string, width: number; i < words.length; i++) {
    word = words[i];
    width = widths[i];
    pixelGrids.push(calculatePixelGrid(word, width, wordHeight));
  }

  let points: Vector[] = [];
  for (let i = 0, pixelGrid: boolean[], width: number, wordPoints: Vector[]; i < words.length; i++) {
    pixelGrid = pixelGrids[i];
    width = widths[i];
    wordPoints = generateSeedPoints(pixelGrid, width, wordHeight, maxPaddedWidth, i);
    points = points.concat(wordPoints);
  }

  return points;

}


function measureWord(word: string, height: number) {
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  let fontDeclaration = `${height}px sans-serif`;
  ctx.font = fontDeclaration;
  let width = Math.ceil(ctx.measureText(word).width);
  return width;
}


function calculatePixelGrid(word: string, width: number, height: number): boolean[] {
  let canvas = document.createElement('canvas');
  setCanvasSize(canvas, width, height);
  let ctx = canvas.getContext('2d');
  let fontDeclaration = `${height}px sans-serif`;
  ctx.font = fontDeclaration;

  ctx.fillStyle = '#f00';
  ctx.font = fontDeclaration;
  ctx.fillText(word, 0, height * 0.75);

  let imageData = ctx.getImageData(0, 0, width, height).data;
  let pixelGrid: boolean[] = [];
  for (let i = 0; i < imageData.length; i += 4) {
    pixelGrid.push(imageData[i] > 0);
  }
  return pixelGrid;
}


function isPixelLit(pixelGrid: boolean[], gridWidth: number, gridHeight: number, x: number, y: number): boolean {
  if (gridWidth < x) {
    throw new Error(`Invalid value for x: ${x}`);
  }
  if (gridHeight < y) {
    throw new Error(`Invalid value for y: ${y}`);
  }
  let gridIndex = x + y * gridWidth;
  return pixelGrid[gridIndex];
}


function generateSeedPoints(pixelGrid: boolean[], gridWidth: number, gridHeight: number, maxGridWidth: number, index: number) {
  let points: Vector[] = [];
  const xOffset = Math.floor((maxGridWidth - gridWidth) / 2) + BOX_PADDING;
  for (let i = 0, x: number; i < gridWidth; i += SEED_GRID_SIZE) {
    for (let j = 0, y: number; j < gridHeight; j += SEED_GRID_SIZE) {
      x = Math.min(Math.round(Math.random() * SEED_GRID_SIZE) + i, gridWidth);
      y = Math.min(Math.round(Math.random() * SEED_GRID_SIZE) + j, gridHeight);
      if (isPixelLit(pixelGrid, gridWidth, gridHeight, x, y)) {
        points.push(new Vector(xOffset + x, BOX_PADDING + y + (gridHeight * index)));
      }
    }
  }
  return points;
}


function setCanvasSize(canvas: HTMLCanvasElement, width: number, height: number): void {
  canvas.setAttribute('width', `${width}`);
  canvas.setAttribute('height', `${height}`);
}
