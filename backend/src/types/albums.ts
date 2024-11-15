import { SafeType } from "../utils/typebox.js";

export const albumSchema = SafeType.Object(
    {
        name: SafeType.String({
            description: "Name of the album.",
        }),
        release_date: SafeType.Number({
            description: "Date the album was released.",
        }),
        imageURL: SafeType.String({
            description: "URL of the album's cover.",
        }),
    },
    {
        $id: "AlbumSchema",
        title: "albumSchema",
    }
);
