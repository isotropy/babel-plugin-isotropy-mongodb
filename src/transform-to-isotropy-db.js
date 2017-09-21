import getAnalyzers from "../../isotropy-ast-analyzer-db/dist";
import translate from "./translator";
import * as t from "babel-types";

export default function(opts) {
  let analyzers;
  // Specifies the isotropy database library
  const libDbSource = t.StringLiteral("isotropy-lib-db");
  const libDbIdentifier =
    "isotropyLibDb_" + Math.random().toString(36).substring(2);

  return {
    plugin: {
      pre() {
        analyzers = getAnalyzers();
      },
      visitor: {
        ImportDeclaration: {
          exit(path, state) {
            const analysis = analyzers.meta.analyzeImportDeclaration(
              path,
              state
            );
            if (!analysis) return;
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
        },

        AssignmentExpression: {
          exit(path, state) {
            const analysis = analyzers.write.analyzeAssignmentExpression(
              path,
              state
            );
            if (!analysis) return;

            const databaseConnectionIdentifier =
              "isotropyMongoConnection_" +
              Math.random().toString(36).substring(2);
            const collectionIdentifier =
              "isotropyMongoCollection_" +
              Math.random().toString(36).substring(2);

            path.replaceWith(
              translate(analysis.value, t.identifier(collectionIdentifier))
            );
            path.skip();
          }
        },

        MemberExpression: {
          exit(path, state) {
            debugger;
            const analysis = analyzers.read.analyzeMemberExpression(
              path,
              state
            );
            if (!analysis) return;

            const databaseConnectionIdentifier =
              "isotropyMongoConnection_" +
              Math.random().toString(36).substring(2);
            const collectionIdentifier =
              "isotropyMongoCollection_" +
              Math.random().toString(36).substring(2);

            path.replaceWith(
              translate(analysis.value, t.identifier(collectionIdentifier))
            );
            path.skip();
          }
        },

        CallExpression: {
          exit(path, state) {
            const analysis = analyzers.read.analyzeCallExpression(path, state);
            if (!analysis) return;

            const databaseConnectionIdentifier =
              "isotropyMongoConnection_" +
              Math.random().toString(36).substring(2);
            const collectionIdentifier =
              "isotropyMongoCollection_" +
              Math.random().toString(36).substring(2);

            path.replaceWith(
              translate(analysis.value, t.identifier(collectionIdentifier))
            );
            path.skip();
          }
        }
      }
    }
  };
}
