export function setCanvasSize(canvas: HTMLCanvasElement, width: number, height: number): void {
  canvas.setAttribute('width', `${width}`);
  canvas.setAttribute('height', `${height}`);
}
