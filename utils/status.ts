import type { GovTagProps } from "~/common.types";
import formStatus from "~/constants/formStatus";
import pagesData from "~/data/pages/pages";
import { PageType } from "~/data/pages/pages.types";

/**
 * Traverses an object to find a nested object with a given pageId / property name
 * @param pageId Page Id / property name
 * @param section Object to traverse
 * @returns Nested object
 */
export function getSection(
	pageId: string,
	section: object
): object | undefined {
	if (typeof section !== "object") {
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
 * Returns the completion status of a ductwork task for the GovTag component
 * @param task
 * @returns Status as GovTagProps
 */
export function getDuctworkStatus(task: object): GovTagProps {
	const form = task as EcaasForm<typeof task>;
	const status = !isFormStarted(form)
		? formStatus.notStarted
		: !checkMvhrHasDuckwork()
			? formStatus.inProgress
			: formStatus.complete;

	return status;
}

/**
 * Returns the completion status of a task for the GovTag component
 * @param task
 * @returns Status as GovTagProps
 */
export function getTaskStatus(task: object): GovTagProps {
	const form = task as EcaasForm<typeof task>;
	let status = isFormStarted(form)
		? formStatus.inProgress
		: formStatus.notStarted;

	if (form.complete) {
		status = formStatus.complete;
	}

	return status;
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

	tasks.forEach((task) => {
		const taskPage = pagesData.find((x) => x.id === task[0]);

		if (taskPage?.type === PageType.Task) {
			const form = task[1] as EcaasForm<(typeof task)[1]>;

			if (isFormStarted(form) || form.complete) {
				status = formStatus.inProgress;
			}

			if (form.complete) {
				complete++;
			}

			if (complete === tasks.length) {
				status = formStatus.complete;
			}
		}

		if (taskPage?.type === PageType.TaskGroup) {
			const taskGroupStatus = getSectionStatus(task[1]);

			if (taskGroupStatus !== formStatus.notStarted) {
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

function isFormStarted<T>(form: EcaasForm<T>): boolean {
	return (
		form.data &&
    (Array.isArray(form.data)
    	? !!form.data.length
    	: !!Object.entries(form.data).length)
	);
}
