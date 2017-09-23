import _isotropyMongoDb from "isotropy-lib-db";


async function addTodo(title, assignee) {
  await _collection.insertMany({ title, assignee });
}
