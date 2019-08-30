import { google } from "googleapis";

import { YOUTUBE_API_KEY } from "../../../config/server";

const youtube = google.youtube({
    auth    : YOUTUBE_API_KEY,
    version : "v3"
});

function durationStrToSeconds(str: string): number {
	const REGEX = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
	const [, hours = 0, minutes = 0, seconds = 0] = REGEX.exec(str) || [];
	return (+seconds) + (+minutes * 60) + (+hours * 60 * 60);
}

async function searchSnippet({ q, nextPageToken : token }: SearchParams) {
    const params: any = {
        part       : "snippet",
        maxResults : 12,
        type       : "video",
        q
    };

    if (token) params.pageToken = token;

    const { data : { items = [], nextPageToken } } = await youtube.search.list(params);
    return { items, nextPageToken };
}

async function search(params : SearchParams) {
	const { items : videosSnippet, nextPageToken } = await searchSnippet(params);
	
	return {
		data : videosSnippet.map((snippetItem) => ({
			// @ts-ignore
			id        : snippetItem.id.videoId || snippetItem.id,
			// @ts-ignore
			thumbnail : snippetItem.snippet.thumbnails.default.url,
			// @ts-ignore
			title     : snippetItem.snippet.title
		})),
		nextPageToken
	};
}

async function contentDetails(ids: string[]) {
	const detailsParams = { part : "contentDetails", id : ids };
	// @ts-ignore
	const { data : { items } } = await youtube.videos.list(detailsParams);
	return items;
}

async function snippet(ids: string[]) {
	const detailsParams = { part : "snippet", id : ids };
	// @ts-ignore
	const { data : { items } } = await youtube.videos.list(detailsParams);
	return items;
}
// @ts-ignore
function mergeVideosInfo(snippet, details) {
	const videos = [];
	for (let i = 0; i < snippet.length; i += 1) {
		const snippetItem = snippet[i];
		const detailsItem = details[i];
		videos[i] = {
			id        : snippetItem.id.videoId || snippetItem.id,
			thumbnail : snippetItem.snippet.thumbnails.medium.url,
			title     : snippetItem.snippet.title,
			duration  : durationStrToSeconds(detailsItem.contentDetails.duration)
		};
	}
	return videos;
}

async function info(ids: string[]): Promise<{ items : Database.Video[] }> {
	const [
		videosSnippet,
		videosDetails
	] = await Promise.all([snippet(ids), contentDetails(ids)]);

	const items = mergeVideosInfo(videosSnippet, videosDetails);

	return { items };
}

export {
	search,
	info,

	searchSnippet,
	snippet,
	contentDetails,

	durationStrToSeconds
};