import fs from "fs";
import { join } from "path";
import { runPreparedQuery } from "./database.js";
import { deleteIcons, insertIcons } from "../queries/dml.queries.js";

const iconsDir = join(process.cwd(), "public", "profile-icons");

const userIconFileNames = fs.readdirSync(iconsDir);

export function readFileSync(filePath: string) {
    try {
        const content = fs.readFileSync(filePath, "utf8");
        return content;
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
}

const files = Object.freeze(
    Object.fromEntries(
        userIconFileNames.map((filename) => [
            filename,
            readFileSync(join(iconsDir, filename))!,
        ])
    )
);

export function getAllUserIcons() {
    return Object.values(files);
}

export function getAllUserIconsFileNames() {
    return Object.keys(files);
}

export function getIconFromFile(filename: string): string | undefined {
    return files[filename];
}

async function updateDB() {
    await runPreparedQuery(deleteIcons, {});
    await runPreparedQuery(insertIcons, {
        input: userIconFileNames.map((filename, index) => {
            return {
                id: index,
                filename,
            };
        }),
    });
}

updateDB();
