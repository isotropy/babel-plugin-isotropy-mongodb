import _isotropyMongoDb from "isotropy-lib-db";


async function getTodos() {
  return (await _collection.sort({ "assignee": 1 })).slice(10, 20);
}
