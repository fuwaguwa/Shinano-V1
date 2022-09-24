import glob from "glob";
import { Event } from "./Event"
import { config } from 'dotenv'
import { promisify } from "util";
import { CommandType } from "../typings/Command";
import { RegisterCommandsOptions } from "../typings/CommandRegistration";
import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from "discord.js";
config();

const promiseGlob = promisify(glob);

export class Shinano extends Client {
    commands: Collection<string, CommandType> = new Collection();

    constructor() {
        super({
            intents: 131071,  
        })  
    }

    start() {
        this.registerModules();
        
        // Login
        this.login(process.env.botToken);


        // Error Catcher
        process.on("unhandledRejection", async (err) => {
            console.error("Unhandled Promise Rejection:\n", err);
        })

        process.on("uncaughtException", async (err) => {
            console.error("Uncaught Promise Exception:\n", err);
        })

        process.on("uncaughtExceptionMonitor", async (err) => {
            console.error("Uncaught Promise Exception (Monitor):\n", err);
        })

        process.on("multipleResolves", async (type, promise, reason) => {
            if (reason.toLocaleString() === "Error: Cannot perform IP discovery - socket closed") return;
            if (reason.toLocaleString() === "AbortError: The operation was aborted") return;
            
            console.error("Multiple Resolves:\n", type, promise, reason);
        })       
    }


    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async registerCommands({commands, guildId}: RegisterCommandsOptions) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registering Commands | Guild: ${guildId}`);
        } else {
            this.application?.commands.set(commands);
            console.log("Registering Commands | Global");
        }
    }

    async registerModules() {
        // Registering Slash Commands
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await promiseGlob(
            `${__dirname}/../commands/*/*{.ts,.js}`
        )

        commandFiles.forEach(async (filePath) => {
            const command: CommandType = await this.importFile(filePath);
            if (!command.name) return;

            this.commands.set(command.name, command);
            slashCommands.push(command);
        })

        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.guildId
            })
        })


        // Initiating Event Listeners
        const eventFiles = await promiseGlob(
            `${__dirname}/../events/*{.ts,.js}`
        )

        eventFiles.forEach(async (filePath) => {
            const event: Event<keyof ClientEvents> = await this.importFile(
                filePath
            )
            this.on(event.event, event.run);
        })
    }
}
