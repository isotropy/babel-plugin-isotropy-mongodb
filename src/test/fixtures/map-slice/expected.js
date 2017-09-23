import _isotropyMongoDb from "isotropy-lib-db";


async function getTodos(who) {
  return (await _collection.aggregate([{ "$project": { "assignee": owner, "createdAt": timestamp } }])).slice(10, 20);
}
