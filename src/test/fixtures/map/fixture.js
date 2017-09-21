import myDb from "../my-db";

async function getTodos() {
  return myDb.todos.map(todo => ({ owner: todo.assignee, timestamp: todo.createdAt }));
}
