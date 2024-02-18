/// <reference types="vite/client" />

interface ImportMetaEnv {
    // Define each environment variable used in your project here
    // For example, for a variable named VITE_42_URL:
    readonly VITE_42_URL: string;

    // If you have more variables, define them similarly:
    // readonly VITE_ANOTHER_VARIABLE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
