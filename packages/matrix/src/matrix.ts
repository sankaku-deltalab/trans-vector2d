import { VectorLike } from "@trans-vector2d/vector";

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

  globalize(localMatrix: MatrixLike): Matrix {
    return Matrix.product(this, localMatrix);
  }

  localize(globalMatrix: MatrixLike): Matrix {
    return Matrix.product(Matrix.inverse(this), globalMatrix);
  }

  inverse(): Matrix {
    return Matrix.inverse(this);
  }

  translate(delta: VectorLike): Matrix {
    return new Matrix(
      this.a,
      this.b,
      this.c,
      this.d,
      this.e + delta.x,
      this.f + delta.y
    );
  }

  rotate(delta: number): Matrix {
    const r = Matrix.from({ rotation: delta });
    return Matrix.product(r, this);
  }

  scaled(scale: VectorLike): Matrix {
    const s = Matrix.from({ scale });
    return Matrix.product(s, this);
  }

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

  asObject(): MatrixLike {
    return { a: this.a, b: this.b, c: this.c, d: this.d, e: this.e, f: this.f };
  }

  asArray(): [number, number, number, number, number, number] {
    return [this.a, this.b, this.c, this.d, this.e, this.f];
  }

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
