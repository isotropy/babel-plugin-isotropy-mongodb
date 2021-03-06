import * as template from "./templates";
import * as t from "babel-types";
import generate from "babel-generator";

export default function translate(analysis) {
  /*
  Based  on  the  analysis  from  the  analyzer  module  (_analysis),
  the appropriate code translation is created by calling the template
  with the corresponding mapper function which is inturn fed with the
  result  of  the  analysis (the first argument).
  */

  if (!analysis.source)
    return {
      connectionString: analysis.module,
      collection: analysis.collection,
      translation: ""
    };

  const currentTranslation = generate(template[analysis.operation](analysis)())
    .code;

  const { connectionString, collection, translation } = translate(
    analysis.source
  );

  return {
    connectionString,
    collection,
    translation: translation.replace(";", ".") + currentTranslation
  };
}
