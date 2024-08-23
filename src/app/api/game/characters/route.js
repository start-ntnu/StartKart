import fs from 'fs/promises';
import path from 'path';
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    const origin = new NextRequest(request).nextUrl.origin;
    const directoryPath = path.resolve('./public/icons');
    //console.log(directoryPath)
    try {
        const res = await fs.readdir(directoryPath);
        
        let mapped = res.map((n) => {
            return {
                name: n.split(/[_.]/).slice(0, -1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
                url: origin + "/icons/" + n
            }
        });
        
        return new NextResponse(JSON.stringify({ characters: mapped }), { status: 200 });
    } catch(err) {
        console.error(err);
        return new NextResponse({ error: "Internal Server Error" }, { status: 500 });
    }
}
