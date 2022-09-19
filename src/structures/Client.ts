import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, Guild, MessageEmbed, TextChannel } from "discord.js";
import { CommandType } from "../typings/Command";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/CommandRegistration";
import { Event } from "./Event"
import {config} from 'dotenv'
config();

const globPromise = promisify(glob);

export class Shinano extends Client {
    commands: Collection<string, CommandType> = new Collection();

    constructor() {
        super({
            intents: 131071,  
        });
    }

    start() {
        this.registerModules();
        
        // Login
        this.login(process.env['botToken']);
    }

    startEventListener() {
        // Error Handler
        process.on("unhandledRejection", async (err) => {
            console.error("Unhandled Promise Rejection:\n", err);
        });
        process.on("uncaughtException", async (err) => {
            console.error("Uncaught Promise Exception:\n", err);
        });
        process.on("uncaughtExceptionMonitor", async (err) => {
            console.error("Uncaught Promise Exception (Monitor):\n", err);
        });
        process.on("multipleResolves", async (type, promise, reason) => {
            if (reason.toLocaleString() === "Error: Cannot perform IP discovery - socket closed") return;
            if (reason.toLocaleString() === "AbortError: The operation was aborted") return;
            
            console.error("Multiple Resolves:\n", type, promise, reason);
        });        
    }
    
    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registering commands to ${guildId}`);
        } else {
            this.application?.commands.set(commands);
            console.log("Registering global commands");
        }
    }

    async registerModules() {
        // Registering Slash Commands
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await globPromise(
            `${__dirname}/../commands/*/*{.ts,.js}`
        );
        commandFiles.forEach(async (filePath) => {
            const command: CommandType = await this.importFile(filePath);
            if (!command.name) return;

            this.commands.set(command.name, command);
            slashCommands.push(command);
        });

        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env['guildId']
            });
        });


        // Start Listening To Events
        const eventFiles = await globPromise(
            `${__dirname}/../events/*{.ts,.js}`
        );
        eventFiles.forEach(async (filePath) => {
            const event: Event<keyof ClientEvents> = await this.importFile(
                filePath
            );
            this.on(event.event, event.run);
        });
    }
}
