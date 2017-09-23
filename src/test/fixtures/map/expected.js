import _isotropyMongoDb from "isotropy-lib-db";


async function getTodos() {
  return await _collection.aggregate([{ "$project": { "assignee": owner, "createdAt": timestamp } }]);
}
