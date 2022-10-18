import { Event } from "../structures/Event";
import { client } from "..";
import { config } from "dotenv";
import { updateServerCount } from "../structures/Utils";
config();

export default new Event("ready", async () => {
    console.log("Shinano is online!");

    
    await updateServerCount();

    // Activities
    client.user.setStatus('online')
    
    setInterval(() => {
        let shikikansCount = client.users.cache.size

        const activitiesList: any = [
            {type: 'PLAYING', message: 'with Laffey'},
            {type: 'WATCHING', message: 'Akagi and Kaga fight'},
            {type: 'WATCHING', message: 'the shikikan'},
            {type: 'LISTENING', message: 'Sandy\'s singing'},
            {type: 'PLAYING', message: 'with a supercar'},
            {type: 'PLAYING', message: 'Azur Lane'},
            {type: 'WATCHING', message: `${shikikansCount.toLocaleString("en-US")} shikikans`}
        ]
        const presence = activitiesList[Math.floor(Math.random() * activitiesList.length)]
        client.user.setActivity(presence.message, {type: presence.type})
    }, 30000)

});
