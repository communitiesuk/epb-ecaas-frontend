import type { GovTaskListItemProps } from "~/components/GovTaskList.vue";
import pagesData, { PageType, type Page } from "~/data/pages";

/**
 * Creates a list of tasks to be used as props for the GovTaskList component
 * based on the current page and its related pages.
 * @returns A function to create a list of GovTaskListItemProps
 */
export function useTaskList() {

	const createTaskList = (page?: Page) => {
		if (!page) {
			return [];
		}

		const store = useEcaasStore();

		const taskList: Array<GovTaskListItemProps> = pagesData
			.filter(p => p.parentId === page!.id && [PageType.Section, PageType.Task, PageType.TaskGroup].includes(p.type!))
			.map(p => {
				return {
					id: p.id,
					title: p.title,
					url: p.url,
					status: {
						tag: store.getStatus(p)
					}
				};
			});

		return taskList;
	};

	return { createTaskList };
}