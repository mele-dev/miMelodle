import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { decorators } from "../../services/decorators.js";
import { SafeType } from "../../utils/typebox.js";
import { PopdleTagName } from "../../plugins/swagger.js";
import { lyricSchema } from "../../types/lyric.js";
import { ParamsSchema } from "../../types/params.js";
import MusixmatchAPI from "../../musixmatch-api/musixmatch.js";
import { sendError } from "../../utils/reply.js";

const lyric: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("/:trackMusixMatchId", {
        onRequest: [decorators.noSecurity],
        schema: {
            security: [],
            params: SafeType.Pick(ParamsSchema, ["trackMusixMatchId"]),
            response: {
                200: SafeType.Pick(lyricSchema, [
                    "lyricsId",
                    "trackId",
                    "lyricsBody",
                    "explicit",
                    "language",
                    "copyright",
                ]),
                ...SafeType.CreateErrors(["notFound", "misdirectedRequest"]),
            },
            summary: "Get lyrics for a specific track",
            description:
                "This endpoint retrieves the lyrics for a given track using its Musixmatch ID",
            tags: ["Lyrics"] satisfies PopdleTagName[],
        },
        async handler(request, reply) {
            /* TODO: No logre que este me ande, tiene pinta de que nos faltan algunos 
            permisos o algo para que la api devuelva las lyrics... */
            const { trackMusixMatchId } = request.params;
            const musixmatch = new MusixmatchAPI();

            const response =
                await musixmatch.getTrackLyrics({ "track_id": trackMusixMatchId });

            if (!response.parse()) {
                return sendError(reply, "misdirectedRequest");
            }

            if (response.body.lyrics) {
                // FIXME
                //const trackLyricsInfo = {
                //    lyricsId: response.lyrics.lyrics_id,
                //    trackId: response.lyrics.trackId,
                //    lyricsBody: response.lyrics.lyricsBody,
                //    explicit: response.lyrics.explicit,
                //    language: response.lyrics.language,
                //    copyright: response.lyrics.copyright,
                //};
                //return reply.send(trackLyricsInfo);
            } else {
                return reply.notFound("Lyrics not found for this track ID.");
            }
        },
    });
};

export default lyric;
