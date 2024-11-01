import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import fastify from "fastify";
import { decorators } from "../../services/decorators.js";
import { SafeType } from "../../utils/typebox.js";
import { MelodleTagName } from "../../plugins/swagger.js";
import { lyricSchema } from "../../types/lyric.js";
import { ParamsSchema } from "../../types/params.js";
import MusixmatchAPI from "../../musixmatch-api/musixmatch.js";

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
                ...SafeType.CreateErrors([]),
            },
            summary: "Get lyrics for a specific track",
            description:
                "This endpoint retrieves the lyrics for a given track using its Musixmatch ID",
            tags: ["Lyrics"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
            /* TODO: No logre que este me ande, tiene pinta de que nos faltan algunos 
            permisos o algo para que la api devuelva las lyrics... */
            const { trackMusixMatchId } = request.params;
            const musixmatch = new MusixmatchAPI();

            const response =
                await musixmatch.getTrackLyrics({ "track_id": trackMusixMatchId });

            if (response.lyrics) {
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
