"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forEach = forEach;
function forEach(array, fn) {
  for (let i = 0; i < array.length; i += 1) {
    const res = fn(array[i], i);
    if (res !== undefined) {
      return res;
    }
  }
  return null;
}