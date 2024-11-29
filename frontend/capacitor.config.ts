import type { CapacitorConfig } from "@capacitor/cli";
import { enviroment } from "./src/enviroments";

const apkHostname = process.env['APK_HOSTNAME'];

const config: CapacitorConfig = {
    appId: "com.example.app",
    appName: "Popdle",
    webDir: "dist/frontend/browser",
    server: {
        allowNavigation: [enviroment.front_url],
        hostname: apkHostname,
    },
    android: {
        allowMixedContent: true,
    },
    plugins: {
        CapacitorHttp: {
            enabled: true,
        },
    },
};

export default config;
