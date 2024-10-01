import fs from "fs";
import { join } from "path";
import { runPreparedQuery } from "./database.js";
import {
    insertIcon,
    selectAllIcons,
} from "../queries/dml.queries.js";

const iconsDir = join(process.cwd(), "assets", "profile-icons");

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
    const allIcons = (await runPreparedQuery(selectAllIcons, {})).map(
        (i) => i.filename
    );
    for (const icon of userIconFileNames) {
        if (allIcons.some((i) => i === icon)) {
            continue;
        }

        await runPreparedQuery(insertIcon, { file: icon });
    }
}

updateDB();
