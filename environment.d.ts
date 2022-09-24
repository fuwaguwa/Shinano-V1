declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            guildId: string;
            mongoDB: string;
            rapidApiKey: string;
            dogApiKey: string;
            catApiKey: string;
            ninjaApiKey: string;
            commandLogging: string;
            deepAIApiKey: string;
            saucenaoApiKey: string;
            malClientId: string;
            discordServicesApiKey: string;
            topggApiKey: string;
            nekobotApiKey: string;
            environment: "dev" | "prod" | "debug";
        }
    }
}


export {};
