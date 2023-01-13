import {
	Guild,
	MessageAttachment,
	TextChannel,
	VoiceChannel,
} from "discord.js";
import fetch from "node-fetch";
import { client } from "..";
import t2c from "table2canvas";
import { Canvas } from "canvas";

export function isImage(url) {
	return url.match(/^http[^\?]*.(jpg|jpeg|png)(\?(.*))?$/gim) != null;
}

export function isImageAndGif(url) {
	return url.match(/^http[^\?]*.(jpg|jpeg|png|gif)(\?(.*))?$/gim) != null;
}

export function toTitleCase(str: string) {
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

export function msToHmsFormat(duration) {
	let seconds: string | number = Math.floor((duration / 1000) % 60);
	let minutes: string | number = Math.floor((duration / (1000 * 60)) % 60);
	let hours: string | number = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;
	return hours + ":" + minutes + ":" + seconds;
}

export function isNum(value) {
	return !isNaN(value);
}

export function strFormat(str: string, obj: any[]) {
	return str.replace(/\{\s*([^}\s]+)\s*\}/g, (m, p1, offset, string) => {
		return obj[p1];
	});
}

export async function updateServerCount() {
	if (client.user.id === "1002189046619045908") return "Not Main Bot";
	// On Discord Services
	await fetch(`https://api.discordservices.net/bot/1002193298229829682/stats`, {
		method: "POST",
		headers: {
			Authorization: process.env.discordServicesApiKey,
		},
		body: JSON.stringify({
			servers: client.guilds.cache.size,
		}),
	});

	// On Top.gg
	await fetch(`https://top.gg/api/bots/1002193298229829682/stats`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			Authorization: process.env.topggApiKey,
		},
		body: JSON.stringify({
			server_count: client.guilds.cache.size,
		}),
	});

	// On Logging Server
	const guild: Guild = await client.guilds.fetch("1002188088942022807");
	const channel = (await guild.channels.fetch(
		"1017460364658610306"
	)) as VoiceChannel;

	channel.setName(`Server Count: ${client.guilds.cache.size}`);
}

export async function createTable(options: {
	columns: string[];
	dataSrc: any[];
	columnSize?: number;
	firstColumnSize?: number;
}) {
	// Structure
	const tableColumns: any[] = [];
	for (let i = 0; i < options.columns.length; i++) {
		let column = {
			title: options.columns[i],
			dataIndex: options.columns[i],
			textAlign: "center",
			textColor: "rgba(255, 255, 255, 1)",
			titleColor: "rgba(255, 255, 255, 1)",
			titleFontSize: "29px",
			textFontSize: "29px",
		};

		if (i == 1 && options.firstColumnSize) {
			column = Object.assign({ width: options.firstColumnSize }, column);
		} else if (options.columnSize) {
			column = Object.assign({ width: options.columnSize }, column);
		}

		tableColumns.push(column);
	}

	const table = new t2c({
		canvas: new Canvas(4, 4),
		columns: tableColumns,
		dataSource: options.dataSrc,
		bgColor: "#2f3136",
	});

	// Uploading the image + returning the link
	const guild: Guild = await client.guilds.fetch("1002188088942022807");
	const channel = await guild.channels.fetch("1022191350835331203");

	const statsMessage = await (channel as TextChannel).send({
		files: [new MessageAttachment(table.canvas.toBuffer(), "image.png")],
	});
	const statsImage = statsMessage.attachments.first().url;

	return statsImage;
}

export function sleep(ms: number) {
	let start = new Date().getTime();
	for (let i = 0; i < 1e7; i++) {
		if (new Date().getTime() - start > ms) {
			break;
		}
	}
}
