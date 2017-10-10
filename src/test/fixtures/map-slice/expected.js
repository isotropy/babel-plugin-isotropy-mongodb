import _isotropyMongoDb from "isotropy-lib-db";


async function getTodos(who) {
  return await _collection.aggregate([{ "$project": { "assignee": owner, "createdAt": timestamp } }]).skip(10).limit(10);
}
