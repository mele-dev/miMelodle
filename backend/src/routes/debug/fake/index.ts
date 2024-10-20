import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../utils/typebox.js";
import { MelodleTagName } from "../../../plugins/swagger.js";
import { sendOk } from "../../../utils/reply.js";
import { decorators } from "../../../services/decorators.js";
import { mockUser, mockUserSchema } from "../../../utils/mocks.js";
import {
    executeTransaction,
    runPreparedQuery,
} from "../../../services/database.js";
import { insertUser } from "../../../queries/dml.queries.js";

export default (async (fastify) => {
    fastify.get("/user", {
        onRequest: [decorators.noSecurity],
        schema: {
            response: {
                200: SafeType.WithExamples(mockUserSchema, [await mockUser()]),
                ...SafeType.CreateErrors([]),
            },
            summary: "Returns random, believable credentials for a user.",
            description: "All fake users have Fake123! as their password.",
            tags: ["Debug", "User"] satisfies MelodleTagName[],
            security: [],
        },
        async handler(_request, reply) {
            return sendOk(reply, 200, await mockUser());
        },
    });

    fastify.post("/users", {
        onRequest: [decorators.noSecurity],
        schema: {
            body: SafeType.Object({
                amount: SafeType.Integer({
                    description: "The amount of users to generate.",
                }),
            }),
            response: {
                201: SafeType.WithExamples(SafeType.Array(mockUserSchema), [
                    [await mockUser(), await mockUser()],
                ]),
                ...SafeType.CreateErrors([]),
            },
            summary: "Create a certain number of fake users.",
            description:
                "We do not check if the user already exists, so this route " +
                "may error. On error, we roll back any changes.",
            tags: ["Debug", "User"] satisfies MelodleTagName[],
            security: [],
        },
        async handler(request, reply) {
            const users = await Promise.all(
                Array(request.body.amount)
                    .fill(0)
                    .map(async () => await mockUser())
            );

            await executeTransaction(async () => {
                for (const user of users) {
                    await runPreparedQuery(insertUser, user);
                }
            });

            return sendOk(reply, 201, users);
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
