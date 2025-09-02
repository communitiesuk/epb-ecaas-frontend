import { page, type PageId } from "~/data/pages/pages";

export function getUrl(pageId: PageId): string {
	return page(pageId).url;
}