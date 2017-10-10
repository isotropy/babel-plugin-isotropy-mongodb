import template from "babel-template";
import * as t from "babel-types";
import generate from "babel-generator";

export function select(analysis) {
  return template(`find();`);
}

export function count(analysis) {
  return template(`count();`);
}

export function remove(analysis) {
  return;
}

export function insert(analysis) {
  return template(`insertMany(${generate(analysis.itemsNode).code});`);
}

export function slice(analysis) {
  return analysis.to
    ? template(`skip(${analysis.from}).limit(${analysis.to - analysis.from});`)
    : template(`skip(${analysis.from});`);
}

export function sort(analysis) {
  const sortDict = analysis.fields
    .reduce(
      (acc, cur) => `${acc}, "${cur.field}": ${cur.ascending ? 1 : -1}`,
      ""
    )
    .slice(2);

  return template(`sort({${sortDict}});`);
}

export function map(analysis) {
  const stringMap = analysis.fields
    .reduce((acc, cur) => `${acc}, "${cur.field}": ${cur.newField}`, "")
    .slice(2);

  return template(`aggregate([
    {"$project": {${stringMap}}}
  ]);`);
}
