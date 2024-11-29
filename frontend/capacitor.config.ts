import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.example.app",
    appName: "Popdle",
    webDir: "dist/frontend/browser",
    server: {
        "cleartext": true,
        allowNavigation: ["192.168.0.102", "https://192.168.1.105"],
    },

};

export default config;
