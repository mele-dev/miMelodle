import { FastifyPluginAsync, FastifyPluginCallback } from "fastify";
import jwt from "./jwt.js";
import swagger from "./swagger.js";
import support from "./support.js";
import sensible from "./sensible.js";
import disciplineChecks from "./disciplineChecks.js";

const plugins: (FastifyPluginAsync<any> | FastifyPluginCallback<any>)[] = [
    jwt,
    swagger,
    support,
    sensible,
    disciplineChecks,
];

export default plugins;
