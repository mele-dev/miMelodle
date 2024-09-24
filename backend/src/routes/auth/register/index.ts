import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import {
    ErrorMessageSchema,
    UserSchema
} from "../../../types/user.js";
import { query } from "../../../services/database.js";
import { SafeType } from "../../../utils/typebox.js";

const tokenSchema = SafeType.Object({
    jwtToken: SafeType.String(),
});

const auth: FastifyPluginAsyncTypebox = async (fastify, opts) => {
    fastify.post("/", {
        schema: {
            body: SafeType.Ref(UserSchema),
            response: {
                200: tokenSchema,
                400: SafeType.Ref(ErrorMessageSchema),
            },
            security: [],
        },

        handler: async function(request, reply) {
            const body = request.body;
            const result = await query(
                String.raw`
                INSERT
                    INTO users (username, email, password_hash, spotify_id, profile_picture_id, name)
                    VALUES ($1, $2, encrypt_password($3), $4, $5, $6)
                        RETURNING id;`,
                [
                    body.username,
                    body.email,
                    body.password,
                    body.spotify_id,
                    body.profile_picture_id,
                    body.name,
                ],
            );
            if (result.rowCount !== 1) {
                return reply.code(400).send({ errorMessage: "Id already exists." });
            }
            const token = fastify.jwt.sign({ id: result.rows[0].id });
            return reply.code(200).send({ jwtToken: token });
        },
    });
};

export default auth;
