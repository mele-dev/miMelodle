import fp from "fastify-plugin";
import cors, { FastifyCorsOptions } from "@fastify/cors";

export default fp<FastifyCorsOptions>(async (fastify) => {
    fastify.register(cors, {
        origin: [
            "https://192.168.0.102",
            "https://192.168.1.5",
            "https://localhost",
            "capacitor://localhost",
            "capacitor://192.168.1.5",
            "capacitor://192.168.0.102",
            "ionic://localhost",
            "ionic://192.168.1.5",
            "ionic://192.168.0.102",
            "https://popdle"
        ]
    });
    console.log("registre cors");
});
