import { getPackage } from "@/npm";
import { type NextRequest } from "next/server";
import { Feed } from "feed";

export async function GET(
  _request: NextRequest,
  {
    params: { packageName },
  }: {
    params: { packageName: string };
  },
) {
  const pkg = await getPackage(packageName, {
    next: {
      revalidate: 60 * 5, // 5 minutes
    },
  });

  const feed = new Feed({
    title: `${packageName} versions`,
    description: `All versions of ${packageName} on npm`,
    id: "",
    copyright: "",
  });

  for (const versionString of Object.keys(pkg.versions).reverse()) {
    const createdAt = pkg.time[versionString];
    if (!createdAt) {
      throw new Error(`No time for ${packageName} ${versionString}`);
    }
    feed.addItem({
      title: `${packageName} v${versionString} has been released`,
      date: createdAt,
      link: `https://www.npmjs.com/package/${packageName}/v/${versionString}`,
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "content-type": "application/rss+xml",
    },
  });
}
