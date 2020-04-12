# `trans-vector2d`

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

Immutable 2d vector and transformation-matrix.

## Install

`npm install trans-vector2d`

## Vector

```javascript
import { Vector } from "transformation-matrix";

const v1 = new Vector(1, 2);
const v2 = new Vector(...[1, 2]);
const v3 = Vector.from({ x: 1, y: 2 });
const v4 = Vector.from({ x: 1, y: 2 });
const vOne = Vector.one; // { x: 1, y: 1 }
const vZero = Vector.zero; // { x: 0, y: 0 }

const v = v1
  .add(v2)
  .sub(v2)
  .mlt(2)
  .div(2)
  .hadamard(v2);

console.log(v.x, v.y);
// v.x = 1; // error

const norm = v1.norm();
const distance = v1.distance(v2);
const unitVector = v1.unit(); // norm = 1
const rotated = v1.rotate(Math.PI);
const angle = v1.angle();
const obj = v1.asObject(); // { x: 1, y: 2}
const art = v1.asArray(); // [1, 2]
const eq = v1.equals(v2); // false
const closing = v1.isClosedTo(v2); // false
```

## Matrix

```javascript
import { Matrix } from "transformation-matrix";

const m1 = new Matrix(1, 0, 0, 1, 2, 3);
/**
 * [a, c, e,
 *  b, d, f,
 *  0, 0, 1]
 */
const m2 = Matrix.from({ a: 1, b: 0, c: 0, d: 1, e: 4, f: 5 });
const m3 = Matrix.from({
  translation: { x: 6, y: 7 },
  rotation: Math.PI,
  scale: { x: 1, y: 1 }
});
const mE = Matrix.identity;

const m = m1
  .globalize(m2)
  .localize(m2)
  .inverse()
  .translate({ x: 1, y: 2 })
  .rotate(Math.PI)
  .scale({ x: 1, y: 1 });

console.log(m.a, m.b, m.c, m.d, m.e, m.e);
// m.a = 1; // error

const { translation, rotation. scale} = m1.decompose();
const gPoint = m1.globalizePoint({ x: 3, y: 4 });
const lPoint = m1.localizePoint({ x: 3, y: 4 });
const eq = m1.equals(m2); // false
const closing = m1.isClosedTo(m2); // false
const obj = m1.asObject();
const ary = m1.asArray();
```
