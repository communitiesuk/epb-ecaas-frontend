export enum PageType {
	Section,
	Task,
	TaskGroup,
	Summary,
	Content
};

export interface Page {
	id: string;
	title: string;
	url: string;
	type?: PageType;
	parentId?: string;
	excludeFromNavigation?: () =>boolean
}