import _isotropyMongoDb from "isotropy-lib-db";


async function getTodos(who) {
  return await _collection.sort({ "priority": 1 }).skip(10).limit(10);
}
