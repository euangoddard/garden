import { Vector } from './vector';


const TWO_PI = Math.PI * 2;


export class Petal {
  private stretchA: number;
  private stretchB: number;
  private startAngle: number;
  private angle: number;
  private growFactor: number;
  private bloom: Bloom;
  private radius: number;
  public isFinished: boolean;

  constructor(stretchA: number, stretchB: number, startAngle: number, angle: number, growFactor: number, bloom: Bloom) {
    this.stretchA = stretchA;
    this.stretchB = stretchB;
    this.startAngle = startAngle;
    this.angle = angle;
    this.bloom = bloom;
    this.growFactor = growFactor;
    this.radius = 1;
    this.isFinished = false;
  }

  draw(): void {
    let ctx = this.bloom.garden.ctx;
    let v1: Vector, v2: Vector, v3: Vector, v4: Vector;
    v1 = new Vector(0, this.radius).rotate(convertDegToRad(this.startAngle));
    v2 = v1.clone().rotate(convertDegToRad(this.angle));
    v3 = v1.clone().multiply(this.stretchA);
    v4 = v2.clone().multiply(this.stretchB);
    ctx.strokeStyle = this.bloom.colour;
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.bezierCurveTo(v3.x, v3.y, v4.x, v4.y, v2.x, v2.y);
    ctx.stroke();
  }

  render(): void {
    if (this.radius <= this.bloom.radius) {
      this.radius += this.growFactor;
      this.draw();
    } else {
      this.isFinished = true;
    }
  }
}

class Bloom {
  public centre: Vector;
  public radius: number;
  public colour: string;
  public garden: Garden;
  private petals: Petal[];
  public isStarted: boolean;

  constructor(centre: Vector, radius: number, colour: string, petalCount: number, garden: Garden) {
    this.centre = centre;
    this.radius = radius;
    this.colour = colour;
    this.garden = garden;
    this.petals = [];
    this.addPetals(petalCount);
    this.garden.addBloom(this);
    this.isStarted = false;
  }

  private addPetals(petalCount: number): void {
    let angle = 360 / petalCount;
    let startAngle = randomInt(0, 90);
    let petal: Petal;
    for (var i = 0; i < petalCount; i++) {
      petal = new Petal(
        random(Garden.options.petalStretch.min, Garden.options.petalStretch.max),
        random(Garden.options.petalStretch.min, Garden.options.petalStretch.max),
        startAngle + i * angle,
        angle,
        random(Garden.options.growFactor.min, Garden.options.growFactor.max),
        this
      );
      this.petals.push(petal);
    }
  }

  public draw(): void {
    let isFinished: boolean = true;
    this.garden.ctx.save();
    this.garden.ctx.translate(this.centre.x, this.centre.y);
    this.petals.forEach((petal: Petal) => {
      petal.render();
      isFinished = isFinished && petal.isFinished;
    });
    this.garden.ctx.restore();
    if (isFinished) {
      this.garden.removeBloom(this);
    }
  }

}

export class Garden {

  public ctx: CanvasRenderingContext2D;
  private element: HTMLCanvasElement;
  private blooms: Bloom[];

  constructor(ctx: CanvasRenderingContext2D, element: HTMLCanvasElement) {
    this.blooms = [];
    this.element = element;
    this.ctx = ctx;
  }

  render(): void {
    this.blooms.filter(bloom => {
      return bloom.isStarted;
    }).forEach(bloom => {
      bloom.draw();
    });
  }

  addBloom(bloom: Bloom): void {
    this.blooms.push(bloom);
  }

  startBlooms(startPoint: Vector): void {
    let distance: number;
    this.blooms.filter((bloom: Bloom) => {
      if (bloom.isStarted) {
        return false;
      }
      distance = Math.sqrt(square(bloom.centre.x - startPoint.x) + square(bloom.centre.y - startPoint.y));
      return distance < Garden.options.bloomStartDistance;
    }).forEach((bloom: Bloom) => {
      bloom.isStarted = true;
    });
  }

  startAllBlooms(): void {
    this.blooms.forEach((bloom: Bloom) => {
      bloom.isStarted = true;
    });
  }

  removeBloom(bloomToRemove: Bloom): Garden {
    let bloom: Bloom;
    for (var i = 0; i < this.blooms.length; i++) {
      bloom = this.blooms[i];
      if (bloom === bloomToRemove) {
        this.blooms.splice(i, 1);
        break;
      }
    }
    return this;
  }

  createRandomBloom(x: number, y: number): void {
    let bloomRadiusRange = this.bloomRadiusRange;
    this.createBloom(
      x,
      y,
      randomInt(bloomRadiusRange.min, bloomRadiusRange.max),
      getRandomRGBA(Garden.options.color.min, Garden.options.color.max, Garden.options.color.opacity),
      randomInt(Garden.options.petalCount.min, Garden.options.petalCount.max)
    );
  }

  createBloom(x: number, y: number, r: number, c: string, pc: number): void {
    new Bloom(new Vector(x, y), r, c, pc, this);
  }

  clear(): void {
    this.blooms = [];
    this.ctx.clearRect(0, 0, this.element.width, this.element.height);
  }

  get bloomRadiusRange(): Range  {
    return {
      min: this.scaleWindowSizeByFactor(Garden.BLOOM_RADIUS_RANGE_FACTORS.min),
      max: this.scaleWindowSizeByFactor(Garden.BLOOM_RADIUS_RANGE_FACTORS.max)
    };
  }

  private scaleWindowSizeByFactor(factor: number): number {
    let averageWindowSize = (window.innerWidth + window.innerHeight) / 2;
    return Math.round(averageWindowSize / factor);
  }

  private static BLOOM_RADIUS_RANGE_FACTORS: Range = {min: 240, max: 75};

  public static options = {
    petalCount: {
      min: 5,
      max: 15
    },
    petalStretch: {
      min: 0.1,
      max: 3
    },
    growFactor: {
      min: 0.1,
      max: 1
    },
    bloomStartDistance: 20,
    color: {
      min: 0,
      max: 255,
      opacity: 0.5
    }
  }

}


function getRandomRGBA(min: number, max: number, a: number) {
  let rgbaString = rgba(
    Math.round(random(min, max)),
    Math.round(random(min, max)),
    Math.round(random(min, max)),
    a
  );
  return rgbaString;
}


function rgba(r: number, g: number, b: number, a: number): string {
  let colour = `rgba(${r}, ${g}, ${b}, ${a})`;
  return colour;
}


function convertDegToRad(angle: number): number {
  return TWO_PI / 360 * angle;
}


function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}


function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


const square = (x: number): number => x ** 2;


interface Range {
  max: number,
  min: number
}
