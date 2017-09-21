import * as mapper from "./mappers";
import * as template from "./templates";
import * as t from "babel-types";
import generate from "babel-generator";

export default function translate(analysis, out) {
  console.log(">>>", analysis);
  /*
  Based  on  the  analysis  from  the  analyzer  module  (_analysis),
  the appropriate code translation is created by calling the template
  with the corresponding mapper function which is inturn fed with the
  result  of  the  analysis (the first argument). This  code  is  then
  turned  into  an  await  expr.  The  mapper  function  also  takes
  the libDbIdentifier variable and the database connection string and
  table from the  config.
  */
  if (analysis.operation === void 0) analysis.operation = "select";

  // if (!analysis.source || (analysis.source && !analysis.source.operation))
  // return template[analysis.operation]()(mapper[analysis.operation](analysis))
  //   .expression;
  if (!analysis.source)
    return template[analysis.operation]()(mapper[analysis.operation](analysis))
      .expression;

  return t.callExpression(
    translate(analysis.source),
    [template[analysis.operation]()(mapper[analysis.operation](analysis))
      .expression]
  );
}

console.log(
  generate(
    translate(
      {
        type: "query",
        operation: "slice",
        from: 10,
        to: 20,
        source: {
          type: "query",
          operation: "sort",
          fields: [{ field: "assignee", ascending: true }],
          source: {
            type: "query",
            module: "todosDbModule",
            identifier: "myDb",
            collection: "todos"
          }
        }
      },
      t.identifier("Hello")
    )
  ).code
);
