import {Garden} from './garden';
import {Vector} from './vector';
import {generatePixelGrid} from './word-pixels';


export function startAnimation() {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let garden = new Garden(ctx, canvas);
    document.body.appendChild(canvas);
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
    let message: string = location.hash.slice(1) || 'Flowers are everywhere';
    let wordGridPoints = generatePixelGrid(message , window.innerWidth, window.innerHeight);
    canvas.setAttribute('width', `${window.innerWidth}`);
    canvas.setAttribute('height', `${window.innerHeight}`);
    wordGridPoints.forEach((point) => {
        garden.createRandomBloom(point.x, point.y);
    });
}


function bindEvents(canvas: HTMLCanvasElement, garden: Garden): void {
    canvas.addEventListener('mousemove', (event: MouseEvent): void => {
        garden.startBlooms(new Vector(event.clientX, event.clientY));
    });
    canvas.addEventListener('touchmove', (event: TouchEvent): void => {
        Array.prototype.forEach.call(event.touches, (touch: Touch) => {
            garden.startBlooms(new Vector(touch.clientX, touch.clientY));
        });
    });
    canvas.addEventListener('click', () => {
        garden.startAllBlooms();
    });
    window.addEventListener('resize', () => {
        populateGarden(canvas, garden);
    });
    window.addEventListener('hashchange', () => {
        populateGarden(canvas, garden);
    });
}