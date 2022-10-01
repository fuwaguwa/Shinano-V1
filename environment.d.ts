declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            guildId: string;
            mongoDB: string;
            rapidApiKey: string;
            ninjaApiKey: string;
            deepAIApiKey: string;
            saucenaoApiKey: string;
            malClientId: string;
            discordServicesApiKey: string;
            topggApiKey: string;
        }
    }
}


export {};
