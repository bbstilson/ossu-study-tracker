// @flow

import type { Map } from 'immutable';

/**
 * Takes a key and an optional value to convert a list of objects to an object
 * of { key: object[value] || object }.
 * Expects an Immutable.Map as the accumulator.
 * @param {string} key - The key from each object to use as the primary key.
 * @param {string?} value - The optional value to grab from the object.
 * @returns {function} - A thunk which takes the accumulator and each object and
 * applies the specified transformation.
 */
export const toImmutableMap = (key: string, value: string) =>
  (map: Map<string, any>, x: any) =>
    map.set(x[key], value ? x[value] : x);
