import fs from "fs";
import { join } from "path";

const icons = fs
    .readdirSync(join(process.cwd(), "public", "profile-icons"))
    .map(d => d);

console.log(icons);
process.exit(1);
