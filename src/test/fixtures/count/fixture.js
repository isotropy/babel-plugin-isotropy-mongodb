import myDb from "../my-db";

async function countTodos() {
  return myDb.todos.length;
}
