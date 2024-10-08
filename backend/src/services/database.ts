import { PreparedQuery } from "@pgtyped/runtime";
import pg from "pg";
import {
    beginTransaction,
    commitTransaction,
    rollbackTransaction,
} from "../queries/dml.queries.js";
const { Pool } = pg;

const pool = new Pool();

// Return bigints as number instead string.
pg.types.setTypeParser(pg.types.builtins.INT8, (str) => parseInt(str));

export const query = async (
    text: string,
    params?: (string | number | string[] | number[])[]
) => {
    // const start = Date.now()
    const res = await pool.query(text, params);
    // const duration = Date.now() - start
    // console.log('executed query', { text, duration, rows: res.rowCount })
    return res;
};

export async function runPreparedQuery<
    T extends PreparedQuery<any, any>,
    R extends ReturnType<T["run"]>,
    P extends Parameters<T["run"]>["0"],
>(preparedQuery: T, params: P extends void ? {} : P): Promise<R> {
    return await (preparedQuery.run(params, pool) as R);
}

/**
 * Wraps the inner code within a postgress transaction which automatically
 * closes before returning, and, if any errors are thrown within the
 * transaction, it is automatically rolled back (and the error is re-thrown).
 *
 * So, the order is: BEGIN; await transaction(); (COMMIT | ROLLBACK);
 */
export async function executeTransaction<TReturn>(
    transaction: () => Promise<TReturn>
) {
    try {
        await runPreparedQuery(beginTransaction, {});
        const output = await transaction();
        await runPreparedQuery(commitTransaction, {});
        return output;
    } catch (e) {
        await runPreparedQuery(rollbackTransaction, {});
        throw e;
    }
}
