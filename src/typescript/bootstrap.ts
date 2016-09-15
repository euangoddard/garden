import { Garden } from "./garden";
import { Vector } from "./vector";
import { generatePixelGrid } from "./word-pixels";
import { setCanvasSize } from "./canvas-utils";


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startAnimation);
} else {
  startAnimation();
}


function startAnimation() {
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  let garden = new Garden(ctx, canvas);

  populateGarden(canvas, garden);

  let renderGarden = function () {
    garden.render();
    requestAnimationFrame(renderGarden);
  };
  renderGarden();
  bindEvents(canvas, garden);
}


function populateGarden(canvas: HTMLCanvasElement, garden: Garden) {
  garden.clear();

  let gardenWidth = window.innerWidth;
  let gardenHeight = window.innerHeight;

  setCanvasSize(canvas, gardenWidth, gardenHeight);

  let message: string = location.hash.slice(1) || 'Flowers are everywhere';
  if (message[0] === '!') {
    message = rot13(message.slice(1));
  }
  let wordGridPoints = generatePixelGrid(message, gardenWidth, gardenHeight);

  wordGridPoints.forEach((point) => {
    garden.createRandomBloom(point.x, point.y);
  });
}


function bindEvents(canvas: HTMLCanvasElement, garden: Garden): void {
  canvas.addEventListener('mousemove', (event: MouseEvent): void => {
    garden.startBlooms(new Vector(event.clientX, event.clientY));
  });

  canvas.addEventListener('touchmove', (event: TouchEvent): void => {
    event.preventDefault();
    Array.prototype.forEach.call(event.touches, (touch: Touch) => {
      garden.startBlooms(new Vector(touch.clientX, touch.clientY));
    });
  });

  canvas.addEventListener('dblclick', () => {
    garden.startAllBlooms();
  });

  window.addEventListener('resize', () => {
    populateGarden(canvas, garden);
  });

  window.addEventListener('hashchange', () => {
    populateGarden(canvas, garden);
  });

  document.querySelector('#close-welcome').addEventListener('click', () => {
    document.querySelector('#welcome').classList.add('hidden');
  });
}

function rot13(value: string): string {
  const valueRot13 = value.split('').map((char: string) => {
    if (!char.match(/[A-Za-z]/)) return char;
    let code = Math.floor(char.charCodeAt(0) / 97);
    let codeRotated = (char.toLowerCase().charCodeAt(0) - 83) % 26 || 26;
    return String.fromCharCode(codeRotated + ((code == 0) ? 64 : 96));
  }).join('');
  return valueRot13;
}
