export interface VectorLike {
  x: number;
  y: number;
}

/**
 * Immutable 2d vector.
 */
export class Vector {
  static zero = new Vector(0, 0);
  static one = new Vector(1, 1);

  /**
   * @param x Immutable x
   * @param y Immutable y
   */
  constructor(public readonly x: number, public readonly y: number) {}

  /**
   * Create added vector.
   *
   * @example
   * new Vector(1, 2).add(new Vector(3, 4)) // { x: 4, y: 6 }
   * @param v Another vector
   * @return Added vector
   */
  add(v: VectorLike): Vector {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  /**
   * Create subtracted vector.
   *
   * @example
   * new Vector(1, 2).sub(new Vector(3, 4)) // { x: -2, y: -4 }
   * @param v Another vector
   * @return Subtracted vector
   */
  sub(v: VectorLike): Vector {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  /**
   * Create hadamard-producted vector.
   *
   * @example
   * new Vector(1, 2).hadamard(new Vector(3, 4)) // { x: 3, y: 8 }
   * @param v Another vector
   * @return Hadamard-producted vector
   */
  hadamard(v: VectorLike): Vector {
    return new Vector(this.x * v.x, this.y * v.y);
  }

  /**
   * Create multiplied vector.
   *
   * @example
   * new Vector(1, 2).mlt(3) // { x: 3, y: 6 }
   * @param s Multiplier
   * @return Multiplied vector
   */
  mlt(s: number): Vector {
    return new Vector(this.x * s, this.y * s);
  }

  /**
   * Create divided vector.
   *
   * @example
   * new Vector(1, 2).mlt(3) // { x: 3, y: 6 }
   * @param s Divider
   * @return Divided vector
   */
  div(s: number): Vector {
    return new Vector(this.x / s, this.y / s);
  }

  /**
   * Compute L2-norm (length of vector).
   *
   * @example
   * new Vector(3, 4).norm() // 5
   * @return L2-norm (length of vector)
   */
  norm(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Create unit vector.
   *
   * @example
   * new Vector(3, 4).unit() // { x: 0.6, y: 0.8 }
   * @return Unit vector
   */
  unit(): Vector {
    return this.div(this.norm());
  }

  /**
   * Create rotated vector.
   *
   * @example
   * new Vector(1, 0).rotate(Math.PI / 2) // { x: 0, y: -1 }
   * @param rotation Rotation as radians
   * @return Rotated vector
   */
  rotate(rotation: number): Vector {
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    return new Vector(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
  }

  /**
   * Compute angle of self.
   *
   * @example
   * new Vector(0, 1).angle() // Math.PI / 2
   * @return Angle of self
   */
  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Compute self equals other.
   *
   * @example
   * const vec = new Vector(0, 1);
   * vec.equals({ x: 0, y: 1 }) // true
   * vec.equals({ x: 0, y: 0 }) // false
   * @param v Another vector
   * @return Self equals other
   */
  equals(v: VectorLike): boolean {
    return this.x === v.x && this.y === v.y;
  }

  /**
   * Compute self is closed to other,
   *
   * @example
   * const vec = new Vector(0, 1);
   * vec.isClosedTo({ x: 0, y: 1 + 10 ** -11 }) // true
   * vec.isClosedTo({ x: 0, y: 0.01 }) // false
   * @param v Another vector
   * @param delta Allowable error
   * @returns Self is closed to other
   */
  isClosedTo(v: VectorLike, delta: number = 10 ** -10): boolean {
    if (delta < 0) throw new Error("delta is negative");
    return Math.abs(this.x - v.x) <= delta && Math.abs(this.y - v.y) <= delta;
  }

  /**
   * Create simple object equals self.
   *
   * @example
   * new Vector(0, 1).asObject() // { x: 0, y: 1 }
   * @return Object equals self
   */
  asObject(): VectorLike {
    return { x: this.x, y: this.y };
  }

  /**
   * Create array equals [x, y].
   *
   * @example
   * new Vector(0, 1).asArray() // [0, 1]
   * @return Array equals [x, y]
   */
  asArray(): [number, number] {
    return [this.x, this.y];
  }

  /**
   * Create Vector from object or array.
   * @example
   * Vector.from({ x: 1, y: 2 }) // { x: 1, y: 2 } as Vector
   * @param v Object or array
   */
  static from(v: VectorLike): Vector {
    return new Vector(v.x, v.y);
  }
}
