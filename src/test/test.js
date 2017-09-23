import should from "should";
import * as babel from "babel-core";
import fs from "fs";
import path from "path";
import makePlugin from "../transform-to-isotropy-mongodb";
import sourceMapSupport from "source-map-support";

sourceMapSupport.install();

describe("isotropy-ast-analyzer-db", () => {
  function run([description, dir, opts]) {
    it(`${description}`, () => {
      const fixturePath = path.resolve(
        __dirname,
        "fixtures",
        dir,
        `fixture.js`
      );
      const outputPath = path.resolve(__dirname, "fixtures", dir, `output.js`);
      const expected = fs
        .readFileSync(__dirname + `/fixtures/${dir}/expected.js`)
        .toString();
      const pluginInfo = makePlugin(opts);

      const babelResult = babel.transformFileSync(fixturePath, {
        plugins: [
          [
            pluginInfo.plugin,
            {
              projects: [
                {
                  dir: "dist/test",
                  modules: [
                    {
                      source: "fixtures/my-db",
                      locations: [
                        {
                          name: "todos",
                          connectionString:
                            "mongodb://localhost:27017/isotropy-test-db"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "transform-object-rest-spread"
        ],
        parserOpts: {
          sourceType: "module",
          allowImportExportEverywhere: true
        },
        babelrc: false
      });
      const actual = babelResult.code + "\n";
      actual.should.deepEqual(expected);
    });
  }

  const tests = [
    // ["collection", "collection"],
    ["count", "count"],
    // ["delete", "delete"],
    ["insert", "insert"],
    ["map", "map"],
    ["map-slice", "map-slice"],
    // ["select", "select"],
    // ["select-count", "select-count"],
    // ["select-map", "select-map"],
    // ["select-slice", "select-slice"],
    // ["select-sort", "select-sort"],
    ["slice", "slice"],
    ["slice-map", "slice-map"],
    // ["slice-single-param", "slice-single-param"],
    ["sort", "sort"],
    ["sort-desc", "sort-desc"],
    ["sort-alt", "sort-alt"],
    ["sort-alt-negative", "sort-alt-negative"],
    ["sort-alt-reverse", "sort-alt-reverse"],
    ["sort-alt-reverse-negative", "sort-alt-reverse-negative"],
    ["sort-alt-slice", "sort-alt-slice"],
    ["sort-slice", "sort-slice"]
    // ["update", "update"]
  ];

  for (const test of tests) {
    run(test);
  }
});
