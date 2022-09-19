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

    const activitiesList: any = [
        {type: 'PLAYING', message: 'with Laffey'},
        {type: 'WATCHING', message: 'Akagi and Kaga fight'},
        {type: 'WATCHING', message: 'the Shikikan'},
        {type: 'WATCHING', message: 'people typing /help'},
        {type: 'LISTENING', message: 'Sandy\'s singing'},
        {type: 'WATCHING', message: 'thighs pics'},
        {type: 'WATCHING', message: 'you'}
    ]
    setInterval(() => {
        const presence = activitiesList[Math.floor(Math.random() * activitiesList.length)]
        client.user.setActivity(presence.message, {type: presence.type})
    }, 30000)

});
