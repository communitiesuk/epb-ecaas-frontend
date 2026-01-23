export type PageType = "root" | "section" | "task" | "taskGroup" | "summary" | "content" | "outputs";

export interface Page {
	id: string;
	title: string;
	url: string;
	type: PageType;
	parentId?: string;
	excludeFromNavigation?: () => boolean,
}