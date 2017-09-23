import _isotropyMongoDb from "isotropy-lib-db";


async function getTodos(who) {
  return (await _collection.skip(10).limit(10)).map(todo => ({ owner: todo.assignee, timestamp: todo.createdAt }));
}
