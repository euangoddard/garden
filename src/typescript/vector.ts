export class Vector {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  rotate(theta: number): Vector {
    var x = this.x;
    var y = this.y;
    this.x = Math.cos(theta) * x - Math.sin(theta) * y;
    this.y = Math.sin(theta) * x + Math.cos(theta) * y;
    return this;
  }

  multiply(scaleFactor: number): Vector {
    this.x *= scaleFactor;
    this.y *= scaleFactor;
    return this;
  }

  clone(): Vector {
    return new Vector(this.x, this.y);
  }

}
