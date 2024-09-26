import { Type } from "@sinclair/typebox";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { query, runPreparedQuery } from "../../services/database.js";
import { deleteUser, selectUsers, updateUser } from "../../queries/dml.queries.js";
import fastify from "fastify";
import { SafeType } from "../../utils/typebox.js";
import { MelodleUserType, UserSchema } from "../../types/user.js";
import { UserType } from "@fastify/jwt";
import { request } from "http";

const profile : FastifyPluginAsyncTypebox = async(fastify, opts) => {
    fastify.get('/:username', {
        onRequest: fastify.authenticate,
        schema:{
            params: SafeType.Object({
                username: UserSchema.properties.username
            })
        },

        async handler(request, reply) {
            const userProfile= await query(`SELECT * FROM users WHERE username=$1;`,[request.params.username])
            return reply.code(200).send(userProfile);
        }
    });

    fastify.put('/:username', {
        onRequest: fastify.authenticate,
        schema:{
            params: SafeType.WithExamples(SafeType.Object({
                username: UserSchema.properties.username
            }), [
                {
                    username: 'cristina'
                }
            ]),
            body: SafeType.WithExamples(SafeType.Omit(
                    UserSchema,
                    ["id", 'spotifyId']
                ), 
                    [
                        {
                            username: "juanchoTanca",
                            email: "juanchoTanca@gmail.com",
                            name: "juancho",
                            password: "Juancho123!",
                            profilePictureId: 1
                        }
                    ]
                ),
            response: {
                200: SafeType.Omit(UserSchema, ['id', 'spotifyId']),
                ...SafeType.CreateErrors([401]),
            },
        },
        handler: async function(request, reply) {

            const queryResult = await runPreparedQuery(updateUser,{
                ...request.body,
                oldUsername: request.params.username
            })

            if (queryResult.length !== 1) {
                return reply.unauthorized("You cannot modify someone else.");
            }

            return reply.code(200).send({
                ...request.body,
            });

        }

    });

    fastify.delete('/:username', {
        onRequest: fastify.authenticate,
        schema: {
            params: SafeType.Pick(UserSchema, ['username']),
            response: {
                200: SafeType.Pick(UserSchema, ['username']),
                ...SafeType.CreateErrors([401]),
            },
        },
        handler: async function(request, reply) {
            const userToDelete = request.user as {
                id: number
            };

            const queryResult = await runPreparedQuery(deleteUser, userToDelete);

            switch (queryResult.length) {
                case 0:
                    return reply.unauthorized("Could not delete person with such crentials.");
                case 1:
                    return reply
                        .code(200)
                default:
                    throw `Deleted ${queryResult.length} rows.`;
            }
        },
}   )}

export default profile;