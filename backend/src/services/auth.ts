import { IInsertUserParams, insertUser } from "../queries/dml.queries.js";
import { executeTransaction, runPreparedQuery } from "./database.js";

export async function registerUser(params: IInsertUserParams) {
    return await executeTransaction(async () => {
        const registerResult = await runPreparedQuery(insertUser, params);

        return registerResult;
    });
}
