import template from "babel-template";

export function count() {
  return template(`count();`);
}

export function select() {
  return template(`find();`);
}

export function insert() {
  return template(`insertMany(ARGS)`);
}

export function slice() {
  return template(`skip(FROM).limit(TO)`)
}

export function sort() {
  return template(`sort({FIELD: ORDER})`);
}

export function map() {

}
