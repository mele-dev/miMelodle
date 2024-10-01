import { SafeType } from "../utils/typebox.js";

export const svgSchema = SafeType.Unsafe<string>({
    $id: "svg",
    content: {
        "image/svg+xml": {
            schema: {
                description: "An svg file.",
                type: "string",
                format: "binary",
            },
        },
    },
});

export const profilePictureSchema = SafeType.Object(
    {
        id: SafeType.Integer({ description: "Identifier for the icon." }),
        filename: SafeType.String({
            description: "File name required to fetch the image from the route"
            + " to get specific user icons.",
        }),
    },
    {
        description: "Information to identify and describe an icon.",
    }
);
