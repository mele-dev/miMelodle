import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";

export function createRangeSchema(amount: number) {
    return SafeType.Object(
        {
            start: SafeType.Integer({
                description:
                    "States when a range starts."
            }),
            amount: SafeType.Integer({
                description:
                    "A number which defines range size.",
                maximum: amount
            })
        },
        {
            description: "A range which indicates the elements of the list to return.",
            $id: "RangeSchema",
            title: "rangeSchema",
        }
    );
}


export type Range = Static<ReturnType<typeof createRangeSchema>>;
