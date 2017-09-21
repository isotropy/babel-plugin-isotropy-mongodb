import ispyDb from "isotropy-lib-db";


async function countTodos() {
  return await ispyDb.count();
}
