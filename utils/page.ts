import pagesData from "~/data/pages/pages";

export function getUrl(pageId: string): string | undefined {
	const page = pagesData.find(p => pageId === p.id);
	return page?.url;
}