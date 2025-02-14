import type { GovTagProps } from "~/common.types";
import formStatus from "~/constants/formStatus";
import pagesData, { PageType } from "~/data/pages";

/**
 * Traverses an object to find a nested object with a given pageId / property name
 * @param pageId Page Id / property name
 * @param section Object to traverse
 * @returns Nested object
 */
export function getSection(pageId: string, section: object): object | undefined {
	if (typeof section !== 'object') {
		return undefined;
	}

	if (pageId in section) {
		return section;
	}

	const entries = Object.entries(section);

	let subsection;

	for (let i = 0; i < entries.length; i++) {
		subsection = getSection(pageId, entries[i][1]);

		if (subsection) {
			break;
		}
	}

	return subsection;
}

/**
 * Returns the completion status of a task for the GovTag component
 * @param task
 * @returns Status as GovTagProps
 */
export function getTaskStatus(task: object): GovTagProps {
	const form = task as EcaasForm<typeof task>;

	return form.complete ? formStatus.complete : formStatus.notStarted;
}

/**
 * Returns the completion status of a section containing nested tasks
 * @param entry 
 * @returns Status as GovTagProps
 */
export function getSectionStatus(section: object): GovTagProps {
	let status = formStatus.notStarted;
	let complete = 0;

	const tasks = Object.entries(section);

	tasks.forEach(task => {
		const taskPage = pagesData.find(x => x.id === task[0]);
		
		if (taskPage?.type === PageType.Task) {
			const form = task[1] as EcaasForm<typeof task[1]>;

			if (form.complete) {
				status = formStatus.inProgress;
				complete++;
			}

			if (complete === tasks.length) {
				status = formStatus.complete;
			}
		}

		if (taskPage?.type === PageType.Section) {
			status = getSectionStatus(task[1]);
		}
	});

	return status;
}