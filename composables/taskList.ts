import type { GovTaskListItemProps } from "~/components/gov/TaskList.vue";
import pagesData from "~/data/pages/pages";
import type { Page, PageType } from "~/data/pages/pages.types";

/**
 * Creates a list of tasks to be used as props for the GovTaskList component
 * based on the current page and its related pages.
 * @returns A function to create a list of GovTaskListItemProps
 */
export function useTaskList() {

	const createTaskList = (page: Page) => {
		const store = useEcaasStore();

		const taskListPageTypes: PageType[] = ["section", "task", "taskGroup"];

		const taskList: Array<GovTaskListItemProps> = pagesData
			.filter(p => p.parentId === page.id && taskListPageTypes.includes(p.type))
			.map(p => {
				return {
					id: p.id,
					title: p.title,
					url: p.url,
					status: {
						tag: store.getStatus(p),
					},
					excluded: !!p.excludeFromNavigation?.call(globalThis),
				};
			});

		return taskList;
	};

	return { createTaskList };
}