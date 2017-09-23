import _isotropyMongoDb from "isotropy-lib-db";


async function getTodos(who) {
  return await _collection.sort({ "assignee": -1 });
}
