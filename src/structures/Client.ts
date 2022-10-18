import glob from "glob";
import mongoose from "mongoose";
import { Event } from "./Event";
import { config } from 'dotenv';
import { promisify } from "util";
import { CommandType } from "../typings/Command";
import { RegisterCommandsOptions } from "../typings/CommandRegistration";
import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, MessageEmbed, TextChannel } from "discord.js";
config();

const promiseGlob = promisify(glob);

export class Shinano extends Client {
    commands: Collection<string, CommandType> = new Collection();

    constructor() {
        super({
            intents: 0,  
        })  
    }


    start() {
        this.registerModules();
        this.connectToDatabase();
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
        });
        
        
        (async () => {
            const guild = await this.guilds.fetch('1002188088942022807')
            const channel = await guild.channels.fetch('1027973574801227776')

            
            // Starting Up
            const startEmbed: MessageEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`Shinano has been started!`)
                .setTimestamp()
            await (channel as TextChannel).send({embeds: [startEmbed]});


            // Heartbeat
            let uptime = 300000
            setInterval(async () => {
                let totalSeconds = (uptime / 1000);
                totalSeconds %= 86400

                let hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                
                let minutes = Math.floor(totalSeconds / 60);
                let seconds = Math.floor(totalSeconds % 60);

                const heartbeatEmbed: MessageEmbed = new MessageEmbed()
                    .setColor('GREY')
                    .setDescription(`Shinano has been running for \`${hours} hours, ${minutes} minutes, ${seconds} seconds\``)
                    .setTimestamp()
                await (channel as TextChannel).send({embeds: [heartbeatEmbed]})

                uptime += 300000
            }, 300000)
        })();
    }   

    
    private connectToDatabase() {
        mongoose.connect(process.env.mongoDB).then(() => {
            console.log('Connected to database!')
        }).catch((err) => {
            console.log(err)
        })
    }


    private async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }


    private async registerCommands({commands, guildId}: RegisterCommandsOptions) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registering Commands | Guild: ${guildId}`);
        } else {
            this.application?.commands.set(commands);
            console.log("Registering Commands | Global");
        }
    }


    private async registerModules() {
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
