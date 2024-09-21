import { Type } from "@sinclair/typebox";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
    ErrorMessageSchema,
    UserSchema
} from "../../../types/user.js";
import { query } from "../../../services/database.js";

const tokenSchema = Type.Object({
    jwtToken: Type.String(),
});

const auth: FastifyPluginAsyncTypebox = async (fastify, opts) => {
    fastify.post("/", {
        schema: {
            body: Type.Ref(UserSchema),
            response: {
                200: tokenSchema,
                400: Type.Ref(ErrorMessageSchema),
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
                    body.password_hash,
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
