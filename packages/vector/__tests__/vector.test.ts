import { Vector } from "../src";

describe("@trans-vector2d/vector.Vector", () => {
  it("can create added vector", () => {
    const vec1 = new Vector(1, 2);
    const vec2 = { x: 3, y: 5 };

    expect(vec1.add(vec2)).toEqual(new Vector(4, 7));
  });

  it("can create subtracted vector", () => {
    const vec1 = new Vector(1, 2);
    const vec2 = { x: 3, y: 5 };

    expect(vec1.sub(vec2)).toEqual(new Vector(-2, -3));
  });

  it("can create hadamard producted vector", () => {
    const vec1 = new Vector(1, 2);
    const vec2 = { x: 3, y: 5 };

    expect(vec1.hadamard(vec2)).toEqual(new Vector(3, 10));
  });

  it("can create multiplied vector", () => {
    const vec1 = new Vector(1, 2);
    const scaler2 = 3;

    expect(vec1.mlt(scaler2)).toEqual(new Vector(3, 6));
  });

  it("can create divided vector", () => {
    const vec1 = new Vector(1, 2);
    const scaler2 = 2;

    expect(vec1.div(scaler2)).toEqual(new Vector(0.5, 1));
  });

  it.each`
    x     | y
    ${1}  | ${2}
    ${-3} | ${4}
    ${5}  | ${-6}
    ${-7} | ${-8}
  `("can create abs vector from { x: $x, y: $y }", ({ x, y }) => {
    const vec = new Vector(x, y).abs();

    expect(vec.x).toBe(Math.abs(x));
    expect(vec.y).toBe(Math.abs(y));
  });

  it("can tell norm", () => {
    const vec1 = new Vector(1, Math.sqrt(3));

    expect(vec1.norm()).toBeCloseTo(2);
  });

  it.each`
    vector            | other             | distance
    ${{ x: 1, y: 2 }} | ${{ x: 1, y: 2 }} | ${0}
    ${{ x: 1, y: 2 }} | ${{ x: 1, y: 3 }} | ${1}
    ${{ x: 1, y: 2 }} | ${{ x: 2, y: 2 }} | ${1}
  `("can tell distance between other", ({ vector, other, distance }) => {
    const vec = Vector.from(vector);

    expect(vec.distance(other)).toBeCloseTo(distance);
  });

  it("can create unit vector", () => {
    const vec1 = new Vector(1, Math.sqrt(3));

    const unit = vec1.unit();
    expect(unit.x).toBeCloseTo(0.5);
    expect(unit.y).toBeCloseTo(Math.sqrt(3) / 2);
  });

  it("can create rotated vector", () => {
    const vec1 = new Vector(2, 0);

    const unit = vec1.rotate(Math.PI / 3);
    expect(unit.x).toBeCloseTo(1);
    expect(unit.y).toBeCloseTo(Math.sqrt(3));
  });

  it("can tell angle", () => {
    const vec1 = new Vector(1, Math.sqrt(3));

    expect(vec1.angle()).toBeCloseTo(Math.PI / 3);
  });

  it.each`
    x            | y
    ${1}         | ${1}
    ${undefined} | ${1}
    ${1}         | ${undefined}
    ${undefined} | ${undefined}
  `("can created by object { x: $x, y: $y }", ({ x, y }) => {
    const vec = Vector.from({ x, y });

    expect(vec).toBeInstanceOf(Vector);
    expect(vec.x).toBeCloseTo(x || 0);
    expect(vec.y).toBeCloseTo(y || 0);
  });

  it("can create object", () => {
    const vec1 = new Vector(1, 2);

    const vec2 = vec1.asObject();
    expect(vec2).not.toBeInstanceOf(Vector);
    expect(vec2).toEqual({ x: 1, y: 2 });
  });

  it("can create array", () => {
    const vec1 = new Vector(1, 2);

    const vec2 = vec1.asArray();
    expect(vec2).toEqual([1, 2]);
  });

  it.each`
    vector            | other               | equal
    ${{ x: 1, y: 2 }} | ${{ x: 1, y: 2 }}   | ${true}
    ${{ x: 1, y: 2 }} | ${{ x: 1, y: 2.1 }} | ${false}
  `("can tell equals", ({ vector, other, equal }) => {
    const vec1 = new Vector(vector.x, vector.y);

    expect(vec1.equals(other)).toBe(equal);
  });

  it.each`
    vector            | other                | equal
    ${{ x: 1, y: 2 }} | ${{ x: 1, y: 2 }}    | ${true}
    ${{ x: 1, y: 2 }} | ${{ x: 1, y: 2.05 }} | ${true}
    ${{ x: 1, y: 2 }} | ${{ x: 1, y: 1.95 }} | ${true}
    ${{ x: 1, y: 2 }} | ${{ x: 1, y: 2.15 }} | ${false}
  `("can tell closed to other", ({ vector, other, equal }) => {
    const delta = 0.1;
    const vec = Vector.from(vector);

    expect(vec.isClosedTo(other, delta)).toBe(equal);
  });

  it("can tell closed to other with default delta", () => {
    const vec1 = new Vector(1, 2);
    const vec2 = new Vector(1, 2 + 10 ** -11);

    expect(vec1.isClosedTo(vec2)).toBe(true);
  });

  it("throw Error when negative delta was passed to isClosedTo", () => {
    const delta = -0.1;
    const vec = new Vector(0, 0);

    expect(() => vec.isClosedTo(vec, delta)).toThrowError();
  });

  it("contain zero vector", () => {
    expect(Vector.zero).toEqual({ x: 0, y: 0 });
  });

  it("contain [1, 1] vector", () => {
    expect(Vector.one).toEqual({ x: 1, y: 1 });
  });
});
