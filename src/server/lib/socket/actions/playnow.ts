import { info }     from "../../youtube";
import { download } from "../../audio";

import { DOMAIN } from "../../../../../config/server";

export default async function playNow(id: string, callback: Function) {
    console.log(id);
    try {
        const { items : [data] } = await info([id]);
        const filename = await download(id);
        console.log(filename);
        callback({
            ...data,
            url : `${DOMAIN}/audio/${filename}`
        });
    } catch(e) {
        console.log(e);
    }
}