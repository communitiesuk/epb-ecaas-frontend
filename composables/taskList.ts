import type { GovTaskListItemProps } from "~/components/GovTaskList.vue";
import pagesData from "~/data/pages";

/**
 * Creates a list of tasks to be used as props for the GovTaskList component
 * based on the current page and its related pages.
 * @returns A function to create a list of GovTaskListItemProps
 */
export function useTaskList() {

	const createTaskListFromPages = () => {
		const store = useEcaasStore();
		const route = useRoute();

		const page = pagesData.find(p => p.url === route.path);

		const taskList: Array<GovTaskListItemProps> = pagesData
			.filter(p => p.parentId === page!.id)
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

	return { createTaskListFromPages };
}