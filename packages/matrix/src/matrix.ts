import { Vector, VectorLike } from "@trans-vector2d/vector";

export interface MatrixComponent {
  translation: VectorLike;
  rotation: number;
  scale: VectorLike;
}

export interface MatrixLike {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

/**
 * Matrix act as transformation matrix.
 * Matrix is immutable.
 *
 * [a, c, e,
 *  b, d, f,
 *  0, 0, 1]
 */
export class Matrix {
  static readonly identity = new Matrix(1, 0, 0, 1, 0, 0);

  constructor(
    public readonly a: number,
    public readonly b: number,
    public readonly c: number,
    public readonly d: number,
    public readonly e: number,
    public readonly f: number
  ) {}

  /**
   * Decompose matrix as translation, rotation and scale.
   *
   * @returns self components
   */
  decompose(): MatrixComponent {
    const translation = { x: this.e, y: this.f };
    const rotation = Math.max(
      Math.atan2(this.b, this.a),
      Math.atan2(-this.c, this.d)
    );
    const cos = Math.cos(rotation);
    const scale = {
      x: this.a / cos,
      y: this.d / cos,
    };
    return { translation, rotation, scale };
  }

  /**
   * Create globalized other matrix.
   *
   * @param localMatrix
   * @returns globalized matrix
   */
  globalize(localMatrix: MatrixLike): Matrix {
    return Matrix.product(this, localMatrix);
  }

  /**
   * Create localize other matrix.
   *
   * @param globalMatrix
   * @returns localized matrix
   */
  localize(globalMatrix: MatrixLike): Matrix {
    return Matrix.product(Matrix.inverse(this), globalMatrix);
  }

  /**
   * Create matrix globalized by other matrix.
   *
   * @param globalMatrix
   * @return globalized matrix
   */
  globalizedBy(globalMatrix: MatrixLike): Matrix {
    return Matrix.product(globalMatrix, this);
  }

  /**
   * Create matrix localized by other matrix.
   *
   * @param localMatrix
   * @returns localized matrix
   */
  localizedBy(localMatrix: MatrixLike): Matrix {
    return Matrix.product(Matrix.inverse(localMatrix), this);
  }

  /**
   * Create inverse matrix from self.
   */
  inverse(): Matrix {
    return Matrix.inverse(this);
  }

  /**
   * Create translated matrix from self.
   *
   * @param delta translation
   * @returns translated matrix
   */
  translated(delta: VectorLike): Matrix {
    return new Matrix(
      this.a,
      this.b,
      this.c,
      this.d,
      this.e + delta.x,
      this.f + delta.y
    );
  }

  /**
   * Create rotated matrix from self.
   *
   * @param delta rotation
   * @returns rotated matrix
   */
  rotated(delta: number): Matrix {
    const r = Matrix.from({ rotation: delta });
    return Matrix.product(r, this);
  }

  /**
   * Create scaled matrix from self.
   *
   * @param scale
   * @returns scaled matrix
   */
  scaled(scale: VectorLike): Matrix {
    const s = Matrix.from({ scale });
    return Matrix.product(s, this);
  }

  /**
   * Globalize point.
   *
   * @param point local point
   * @returns globalized point
   */
  globalizePoint(point: VectorLike): Vector {
    return Matrix.productVector(this, point);
  }

  /**
   * Localize point.
   *
   * @param point global point
   * @returns localized point
   */
  localizePoint(point: VectorLike): Vector {
    return Matrix.productVector(this.inverse(), point);
  }

  /**
   * Return self equals to other
   *
   * @param other other matrix
   * @returns self equals to other
   */
  equals(other: MatrixLike): boolean {
    return (
      this.a === other.a &&
      this.b === other.b &&
      this.c === other.c &&
      this.d === other.d &&
      this.e === other.e &&
      this.f === other.f
    );
  }

  /**
   * Return self elements is closed to other
   *
   * @param other other matrix
   * @param delta allowable error
   * @returns self is closed to other
   */
  isClosedTo(other: MatrixLike, delta = 10 ** -10): boolean {
    if (delta < 0) throw new Error("delta is negative");
    return (
      Math.abs(this.a - other.a) <= delta &&
      Math.abs(this.b - other.b) <= delta &&
      Math.abs(this.c - other.c) <= delta &&
      Math.abs(this.d - other.d) <= delta &&
      Math.abs(this.e - other.e) <= delta &&
      Math.abs(this.f - other.f) <= delta
    );
  }

  /**
   * Create object contains elements of self.
   *
   * @returns object contains elements of self
   */
  asObject(): MatrixLike {
    return { a: this.a, b: this.b, c: this.c, d: this.d, e: this.e, f: this.f };
  }

  /**
   * Create array contains elements of self.
   *
   * @returns [a, b, c, d, e, f]
   */
  asArray(): [number, number, number, number, number, number] {
    return [this.a, this.b, this.c, this.d, this.e, this.f];
  }

  /**
   * Create translating matrix.
   *
   * @param delta Translation.
   * @returns Translation matrix.
   */
  static translation(delta: VectorLike): Matrix {
    return Matrix.identity.translated(delta);
  }

  /**
   * Create rotating matrix.
   *
   * @param angle Rotation angle in radians.
   * @returns Rotation matrix.
   */
  static rotation(angle: number): Matrix {
    return Matrix.identity.rotated(angle);
  }

  /**
   * Create scaling matrix.
   *
   * @param scale Scale.
   * @returns Scaling matrix.
   */
  static scaling(scale: VectorLike): Matrix {
    return Matrix.identity.scaled(scale);
  }

  /**
   * Create Matrix from elements or components.
   *
   * @param component object contains elements or translation, rotation, and scale
   * @returns Matrix
   */
  static from(component: Partial<MatrixComponent> | MatrixLike): Matrix {
    if ("a" in component) {
      return new Matrix(
        component.a,
        component.b,
        component.c,
        component.d,
        component.e,
        component.f
      );
    }
    const t = component.translation || { x: 0, y: 0 };
    const s = component.scale || { x: 1, y: 1 };
    const r = component.rotation || 0;
    const sin = Math.sin(r);
    const cos = Math.cos(r);
    return new Matrix(s.x * cos, s.x * sin, -s.y * sin, s.y * cos, t.x, t.y);
  }

  /**
   * Create matrix from product.
   *
   * @param a
   * @param b
   * @returns result
   */
  static product(a: MatrixLike, b: MatrixLike): Matrix {
    return new Matrix(
      a.a * b.a + a.c * b.b,
      a.b * b.a + a.d * b.b,
      a.a * b.c + a.c * b.d,
      a.b * b.c + a.d * b.d,
      a.a * b.e + a.c * b.f + a.e,
      a.b * b.e + a.d * b.f + a.f
    );
  }

  /**
   * Create Vector from m*v.
   *
   * @param m matrix
   * @param v vector
   * @returns Vector
   */
  static productVector(m: MatrixLike, v: VectorLike): Vector {
    return new Vector(m.a * v.x + m.c * v.y + m.e, m.b * v.x + m.d * v.y + m.f);
  }

  /**
   * Create matrix from inverse.
   *
   * @param m input matrix
   * @returns inverse matrix
   */
  static inverse(m: MatrixLike): Matrix {
    // https://www.wolframalpha.com/input/?i=Inverse+[{{a%2Cc%2Ce}%2C{b%2Cd%2Cf}%2C{0%2C0%2C1}}]&lang=ja
    const denom = m.a * m.d - m.b * m.c;

    return new Matrix(
      m.d / denom,
      m.b / -denom,
      m.c / -denom,
      m.a / denom,
      (m.d * m.e - m.c * m.f) / -denom,
      (m.b * m.e - m.a * m.f) / denom
    );
  }
}
