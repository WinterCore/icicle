// @ts-ignore-file
import { google, youtube_v3 } from "googleapis";

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
	const detailsParams = { part : "contentDetails", id : ids.join(","), maxResults : 50 };
	// @ts-ignore
	const { data : { items } } = await youtube.videos.list(detailsParams);
	return items;
}

async function snippet(ids: string[]) {
	const detailsParams = { part : "snippet", id : ids.join(",") };
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
		if (!snippetItem.snippet.thumbnails) {
			continue;
		}
		videos[i] = {
			id        : snippetItem.snippet.resourceId ? snippetItem.snippet.resourceId.videoId : snippetItem.id,
			thumbnail : snippetItem.snippet.thumbnails.default.url,
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


async function getPlaylistItems(id: string): Promise<{ items : Database.Video[], data : { name : string } }|null> {
	const rawData = await youtube.playlists.list({ part : "snippet", id, maxResults : 50 });
	const playlists = rawData.data.items;
	if (!playlists) {
		return null;
	}
	const data = { name : playlists[0].snippet ? playlists[0].snippet.title as string : "" };
	let snippetItems: youtube_v3.Schema$PlaylistItem[] = [];
	let contentDetailsItems: youtube_v3.Schema$Video[] = [];
	let token = "";
	do {
		const {
			data : {
				// @ts-ignore
				nextPageToken,
				items : videoItems,
				// @ts-ignore
				pageInfo : { totalResults }
			}
		} = await youtube.playlistItems.list({ part : "snippet", maxResults : 50, playlistId : id, pageToken : token });

		
		// @ts-ignore
		const ids = videoItems.map(item => item.snippet.resourceId.videoId);
		// @ts-ignore
		const itemsContentDetails = await contentDetails(ids);
		// @ts-ignore
		token = nextPageToken;
		// @ts-ignore
		snippetItems = [...snippetItems, ...videoItems];
		// @ts-ignore
		contentDetailsItems = [...contentDetailsItems, ...itemsContentDetails];
	} while(token);
	return { items : mergeVideosInfo(snippetItems, contentDetailsItems), data };
}

export {
	search,
	info,

	searchSnippet,
	snippet,
	contentDetails,

	getPlaylistItems,

	durationStrToSeconds
};