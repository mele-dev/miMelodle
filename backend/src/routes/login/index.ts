import { Type } from "@sinclair/typebox";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { UserSchema } from '../../types/user.js';
import { query } from "../../services/database.js";

