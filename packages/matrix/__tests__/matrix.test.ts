import { Matrix } from "../src";
import { Vector } from "@trans-vector2d/vector";

const globalizingMatrixes = (): {
  baseMatrix: Matrix;
  localMatrix: Matrix;
  globalMatrix: Matrix;
} => {
  const baseMatrix = Matrix.from({
    translation: { x: 1, y: 1 },
    rotation: Math.PI / 2,
    scale: { x: 0.5, y: 1 },
  });
  const localMatrix = Matrix.from({
    translation: { x: 2, y: 1 },
    rotation: 0,
    scale: { x: 1, y: 1 },
  });
  const globalMatrix = Matrix.from({
    translation: { x: 0, y: 2 },
    rotation: Math.PI / 2,
    scale: { x: 0.5, y: 1 },
  });
  return { baseMatrix, localMatrix, globalMatrix };
};

describe("@trans-vector2d/matrix.Matrix", () => {
  it("can be created from translation, rotation and scale", () => {
    const m = Matrix.from({
      translation: { x: 1, y: 1 },
      rotation: Math.PI / 2,
      scale: { x: 1, y: 3 },
    });

    expect(m.a).toBeCloseTo(0);
    expect(m.b).toBeCloseTo(1);
    expect(m.c).toBeCloseTo(-3);
    expect(m.d).toBeCloseTo(0);
    expect(m.e).toBeCloseTo(1);
    expect(m.f).toBeCloseTo(1);
  });

  it("can be created from object contains elements", () => {
    const m = Matrix.from({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 });

    expect(m.a).toBeCloseTo(1);
    expect(m.b).toBeCloseTo(2);
    expect(m.c).toBeCloseTo(3);
    expect(m.d).toBeCloseTo(4);
    expect(m.e).toBeCloseTo(5);
    expect(m.f).toBeCloseTo(6);
  });

  it("can decompose translation, rotation and scale", () => {
    const translation = { x: 1, y: 1 };
    const rotation = Math.PI / 2;
    const scale = { x: 1, y: 3 };

    const matrix = Matrix.from({ translation, rotation, scale });
    const decomposed = matrix.decompose();

    expect(decomposed.translation).toBeInstanceOf(Vector);
    expect(decomposed.scale).toBeInstanceOf(Vector);

    expect(decomposed.translation).toEqual(Vector.from(translation));
    expect(decomposed.rotation).toBeCloseTo(rotation);
    expect(decomposed.scale).toEqual(Vector.from(scale));
  });

  it.each`
    tx      | ty
    ${0}    | ${0}
    ${0.1}  | ${0}
    ${0}    | ${0.1}
    ${-0.1} | ${-0.1}
  `("can create from only transform ($tx, $ty)", ({ tx, ty }) => {
    const translation: { x: number; y: number } = { x: tx, y: ty };
    const matrix = Matrix.from({ translation });
    const decomposed = matrix.decompose();

    expect(decomposed.translation).toEqual(translation);
    expect(decomposed.rotation).toBeCloseTo(0);
    expect(decomposed.scale).toEqual({ x: 1, y: 1 });
  });

  it.each`
    rotation
    ${0}
    ${(Math.PI / 4) * 1}
    ${(Math.PI / 4) * 2}
    ${(Math.PI / 4) * 3}
    ${(Math.PI / 4) * 4}
  `("can create from only rotation $rotation", ({ rotation }) => {
    const matrix = Matrix.from({ rotation });
    const decomposed = matrix.decompose();

    expect(decomposed.translation).toEqual({ x: 0, y: 0 });
    expect(decomposed.rotation).toBeCloseTo(rotation);
    expect(decomposed.scale).toEqual({ x: 1, y: 1 });
  });

  it.each`
    sx      | sy
    ${1}    | ${1}
    ${-0.1} | ${0.1}
    ${0.1}  | ${-0.1}
    ${-0.1} | ${-0.1}
  `("can create from only scale ($sx, $sy)", ({ sx, sy }) => {
    const scale: { x: number; y: number } = { x: sx, y: sy };
    const matrix = Matrix.from({ scale });
    const decomposed = matrix.decompose();

    const expectedRotation = sx >= 0 || sy >= 0 ? 0 : -Math.PI;
    const expectedScale =
      sx >= 0 || sy >= 0 ? { x: sx, y: sy } : { x: -sx, y: -sy };
    expect(decomposed.translation).toEqual({ x: 0, y: 0 });
    expect(decomposed.rotation).toBeCloseTo(expectedRotation);
    expect(decomposed.scale.x).toBeCloseTo(expectedScale.x);
    expect(decomposed.scale.y).toBeCloseTo(expectedScale.y);
  });

  it("can globalize other matrix", () => {
    const { baseMatrix, localMatrix, globalMatrix } = globalizingMatrixes();

    const globalized1 = baseMatrix.globalize(localMatrix);
    const globalized2 = localMatrix.globalizedBy(baseMatrix);

    for (const v of "abcdef") {
      const v2 = v as "a" | "b" | "c" | "d" | "e" | "f";
      expect(globalized1[v2]).toBeCloseTo(globalMatrix[v2]);
      expect(globalized2[v2]).toBeCloseTo(globalMatrix[v2]);
    }
  });

  it("can localize other matrix", () => {
    const { baseMatrix, localMatrix, globalMatrix } = globalizingMatrixes();

    const localized1 = baseMatrix.localize(globalMatrix);
    const localized2 = globalMatrix.localizedBy(baseMatrix);

    for (const v of "abcdef") {
      const v2 = v as "a" | "b" | "c" | "d" | "e" | "f";
      expect(localized1[v2]).toBeCloseTo(localMatrix[v2]);
      expect(localized2[v2]).toBeCloseTo(localMatrix[v2]);
    }
  });

  it("can create translated matrix", () => {
    const m = Matrix.from({ translation: { x: 1, y: 2 } });
    const m2 = m.translated({ x: 3, y: 4 });

    const decomposed = m2.decompose();
    expect(decomposed.translation).toEqual({ x: 4, y: 6 });
    expect(decomposed.rotation).toBeCloseTo(0);
    expect(decomposed.scale).toEqual({ x: 1, y: 1 });
  });

  it("can create rotated matrix", () => {
    const m = Matrix.from({ translation: { x: 1, y: 2 }, rotation: 1 });
    const m2 = m.rotated(Math.PI / 2);

    const decomposed = m2.decompose();
    expect(decomposed.translation.x).toBeCloseTo(-2);
    expect(decomposed.translation.y).toBeCloseTo(1);
    expect(decomposed.rotation).toBeCloseTo(1 + Math.PI / 2);
    expect(decomposed.scale.x).toBeCloseTo(1);
    expect(decomposed.scale.y).toBeCloseTo(1);
  });

  it("can create scaled matrix", () => {
    const m = Matrix.from({ translation: { x: 1, y: 2 } });
    const m2 = m.scaled({ x: 3, y: 4 });

    const decomposed = m2.decompose();
    expect(decomposed.translation).toEqual({ x: 3, y: 8 });
    expect(decomposed.rotation).toBeCloseTo(0);
    expect(decomposed.scale).toEqual({ x: 3, y: 4 });
  });

  it("can create inverse matrix", () => {
    const m = new Matrix(1, 2, 3, 4, 5, 6);
    const im = m.inverse();

    expect(im).toEqual({ a: -2, b: 1, c: 1.5, d: -0.5, e: 1, f: -2 });
  });

  it("can tell equals", () => {
    const m = new Matrix(1, 2, 3, 4, 5, 6);
    const m1 = new Matrix(1, 2, 3, 4, 5, 6);
    const m2 = new Matrix(1, 2, 3, 4, 5, 7);

    expect(m.equals(m1)).toBe(true);
    expect(m.equals(m2)).toBe(false);
  });

  it("can tell closing to other matrix", () => {
    const delta = 10 ** -1;
    const m = new Matrix(1, 2, 3, 4, 5, 6);
    const m1 = new Matrix(1, 2, 3, 4, 5, 6);
    const m2 = new Matrix(1, 2, 3, 4, 5, 6 + delta / 2);
    const m3 = new Matrix(1, 2, 3, 4, 5, 7);

    expect(m.equals(m1)).toBe(true);
    expect(m.isClosedTo(m2, delta)).toBe(true);
    expect(m.isClosedTo(m3)).toBe(false);
  });

  it("can globalize point", () => {
    const localPoint = { x: 1, y: 2 };
    const m = Matrix.from({
      translation: { x: 3, y: 4 },
      rotation: Math.PI / 2,
    });

    const globalPoint = m.globalizePoint(localPoint);
    expect(globalPoint.x).toBeCloseTo(1);
    expect(globalPoint.y).toBeCloseTo(5);
  });

  it("can localize point", () => {
    const globalPoint = { x: 1, y: 5 };
    const m = Matrix.from({
      translation: { x: 3, y: 4 },
      rotation: Math.PI / 2,
    });

    const localPoint = m.localizePoint(globalPoint);
    expect(localPoint.x).toBeCloseTo(1);
    expect(localPoint.y).toBeCloseTo(2);
  });

  it("throw Error when use negative delta in isClosedTo()", () => {
    const delta = 10 * -1;
    const m = new Matrix(1, 2, 3, 4, 5, 6);

    expect(() => m.isClosedTo(m, delta)).toThrowError();
  });

  it("can create object", () => {
    const m1 = new Matrix(1, 2, 3, 4, 5, 6);
    const m2 = m1.asObject();

    expect(m2).not.toBeInstanceOf(Matrix);
    expect(m2).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 });
  });

  it("can create array", () => {
    const m1 = new Matrix(1, 2, 3, 4, 5, 6);
    const m2 = m1.asArray();

    expect(m2).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("contain identity matrix", () => {
    const e = Matrix.identity.decompose();
    expect(e.translation).toEqual({ x: 0, y: 0 });
    expect(e.rotation).toBeCloseTo(0);
    expect(e.scale).toEqual({ x: 1, y: 1 });
  });

  it("can create translation matrix", () => {
    const m = Matrix.translation({ x: 1, y: 2 });
    const c = m.decompose();

    expect(c.translation).toEqual({ x: 1, y: 2 });
    expect(c.rotation).toBeCloseTo(0);
    expect(c.scale).toEqual({ x: 1, y: 1 });
  });

  it("can create rotation matrix", () => {
    const m = Matrix.rotation(1);
    const c = m.decompose();

    expect(c.translation).toEqual({ x: 0, y: 0 });
    expect(c.rotation).toBeCloseTo(1);
    expect(c.scale).toEqual({ x: 1, y: 1 });
  });

  it("can create scaling matrix", () => {
    const m = Matrix.scaling({ x: 1, y: 2 });
    const c = m.decompose();

    expect(c.translation).toEqual({ x: 0, y: 0 });
    expect(c.rotation).toBeCloseTo(0);
    expect(c.scale).toEqual({ x: 1, y: 2 });
  });

  it("can compute product", () => {
    const m1 = new Matrix(1, 2, 3, 4, 5, 6);
    const m2 = new Matrix(7, 8, 9, 10, 11, 12);
    const p = Matrix.product(m1, m2);

    expect(p).toEqual({ a: 31, b: 46, c: 39, d: 58, e: 52, f: 76 });
  });
});
