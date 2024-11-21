import { faker } from "@faker-js/faker";
import { runPreparedQuery } from "../services/database.js";
import { selectAllIcons } from "../queries/dml.queries.js";
import { SafeType } from "./typebox.js";
import { userSchema } from "../types/user.js";
import { Value } from "@sinclair/typebox/value";
import { Static } from "@sinclair/typebox";

export const mockUserSchema = SafeType.Pick(userSchema, [
    "name",
    "email",
    "username",
    "password",
    "profilePictureId",
]);

type MockUser = Static<typeof mockUserSchema>;

export async function mockUser(): Promise<MockUser> {
    const sex = faker.person.sexType();
    const firstName = faker.person.firstName(sex);
    const lastName = faker.person.lastName(sex);
    const prefix = faker.person.prefix(sex);
    const suffix = faker.person.suffix();
    const profilePictures = await runPreparedQuery(selectAllIcons, {});

    if (profilePictures.length === 0) {
        profilePictures.push({
            id: 1,
            filename: "This profile picture wont work.",
        });
    }

    const output: MockUser = {
        name: `${prefix} ${firstName} ${lastName} ${suffix}`,
        username: faker.internet.userName({ firstName, lastName }),
        password: "Fake123!",
        email: faker.internet.email({ firstName, lastName }),
        profilePictureId: faker.helpers.arrayElement(profilePictures).id,
    };

    if (!Value.Check(mockUserSchema, output)) {
        return await mockUser();
    }

    return output;
}
