import getAnalyzers from "isotropy-ast-analyzer-db";
import translate from "./translator";
import * as t from "babel-types";
import template from "babel-template";
const babylon = require("babylon");
import generate from "babel-generator";

export default function(opts) {
  const analyzers = getAnalyzers();
  let libDbIdentifier;
  // Specifies the isotropy database library
  const libDbSource = t.StringLiteral("isotropy-lib-db");
  // Returns collision free identifiers for mongoConnection and the Collection
  const identifierResolver = path => ({
    dbConnectionIdentifier: path.scope.generateUidIdentifier("dbConnection")
      .name,
    collectionIdentifier: path.scope.generateUidIdentifier("collection").name
  });
  /* Returns an array of two expressions
      > AssignmentExpression to mongoDB with the connectionString
      > AssignmentExpression to collection with the connectionString and collection
  */
  const mongoAccessResolver = (
    connectionString,
    collection,
    databaseConnectionIdentifier,
    collectionIdentifier
  ) => {
    const dbConId = template(
      `const ${databaseConnectionIdentifier} = ${libDbIdentifier}.MongoClient.connect("${connectionString}");`
    )();
    const colId = template(
      `const ${collectionIdentifier} = db.collection("${collection}");`
    )();
    dbConId.declarations[0].init = t.awaitExpression(test.declarations[0].init);
    colId.declarations[0].init = t.awaitExpression(test.declarations[0].init);
    return [dbConId, colId];
  };

  const visitor = {};

  visitor.ImportDeclaration = {
    exit(path, state) {
      const analysis = analyzers.meta.analyzeImportDeclaration(path, state);
      if (!analysis) return;
      libDbIdentifier = path.scope.generateUidIdentifier("isotropyMongoDb")
        .name;
      /*
        Inserts two statements:
          * isotropy db lib module import
        */
      path.replaceWith(
        t.importDeclaration(
          [t.importDefaultSpecifier(t.identifier(libDbIdentifier))],
          libDbSource
        )
      );
      path.skip();
    }
  };

  visitor.AssignmentExpression = function(path, state) {
    const analysis = analyzers.write.analyzeAssignmentExpression(path, state);
    if (!analysis) return;

    const { collectionIdentifier, dbConnectionIdentifier } = identifierResolver(
      path
    );

    const { connectionString, collection, translation } = translate(
      analysis.value
    );

    const translatedNode = babylon.parse(
      collectionIdentifier + "." + translation
    ).program.body[0].expression;

    // const test = mongoAccessResolver(
    //   connectionString,
    //   collection,
    //   dbConnectionIdentifier,
    //   collectionIdentifier
    // );

    path.replaceWith(t.awaitExpression(translatedNode));

    path.skip();
  };

  visitor.MemberExpression = function(path, state) {
    const analysis = analyzers.read.analyzeMemberExpression(path, state);
    if (!analysis) return;

    // Handles return db.todos (find query)
    // collection
    // TODO Change analyzer to return the analysis in the transformed format
    if (!analysis.value.operation) {
      analysis.value = {
        operation: "select",
        source: analysis.value
      };
    }

    const { collectionIdentifier, dbConnectionIdentifier } = identifierResolver(
      path
    );

    const { connectionString, collection, translation } = translate(
      analysis.value
    );

    const translatedNode = babylon.parse(
      collectionIdentifier + "." + translation
    ).program.body[0].expression;

    // const test = mongoAccessResolver(
    //   connectionString,
    //   collection,
    //   dbConnectionIdentifier,
    //   collectionIdentifier
    // );

    path.replaceWith(t.awaitExpression(translatedNode));

    path.skip();
  };

  visitor.CallExpression = function(path, state) {
    const analysis = analyzers.read.analyzeCallExpression(path, state);
    if (!analysis) return;

    const { collectionIdentifier, dbConnectionIdentifier } = identifierResolver(
      path
    );

    const { connectionString, collection, translation } = translate(
      analysis.value
    );

    const translatedNode = babylon.parse(
      collectionIdentifier + "." + translation
    ).program.body[0].expression;

    // const test = mongoAccessResolver(
    //   connectionString,
    //   collection,
    //   dbConnectionIdentifier,
    //   collectionIdentifier
    // );

    path.replaceWith(t.awaitExpression(translatedNode));

    path.skip();
  };

  return { visitor };
}
