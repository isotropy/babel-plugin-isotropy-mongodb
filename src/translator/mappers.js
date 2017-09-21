import * as t from "babel-types";

export function count(analysis, collectionIdentifier) {
  return {};
}

export function select(analysis, collectionIdentifier) {
  return analysis.predicate
    ? {
        ARGS: analysis.predicate
      }
    : {};
}

export function slice(analysis, collectionIdentifier) {
  return {
    FROM: t.numericLiteral(analysis.from),
    TO: t.numericLiteral(analysis.to - analysis.from)
  };
}

export function sort(analysis, collectionIdentifier) {
  return {
    FIELD: t.stringLiteral(analysis.fields[0].field),
    ORDER: analysis.fields[0].ascending
      ? t.numericLiteral(1)
      : t.numericLiteral(-1)
  };
}

export function map(analysis, collectionIdentifier) {
  return {};
}
