import { objectEntries } from "ts-extras";
import type { GovTagProps } from "~/common.types";
import formStatus from "~/constants/formStatus";
import pagesData from "~/data/pages/pages";
import { PageType  } from "~/data/pages/pages.types";
import type {Page} from "~/data/pages/pages.types";

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

	for (const entry of entries) {
		subsection = getSection(pageId, entry[1]);

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
export function getDuctworkStatus(task: EcaasForm<boolean>): GovTagProps {
	const store = useEcaasStore();
	const form = task;
	const status = !isFormStarted(form)
		? formStatus.notStarted
		:( !checkMvhrHasDuctwork() || !store.infiltrationAndVentilation.ductwork.complete)
			? formStatus.inProgress
			: formStatus.complete;

	return status;
}

/**
 * Returns the completion status of a task for the GovTag component
 * @param task
 * @returns Status as GovTagProps
 */
export function getTaskStatus(task: EcaasForm<boolean>): GovTagProps {
	const form = task;
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
export function getSectionStatus(section: Record<string, object>): GovTagProps {
	let status = formStatus.notStarted;
	let complete = 0;

	const tasks = objectEntries(section);

	tasks.forEach((task) => {
		const taskPage: Page | undefined = pagesData.find((x) => x.id === task[0]);

		if (!taskPage) {
			complete++; // if there's no task page, it shouldn't affect whether we consider everything else to be complete
		}

		if (taskPage?.type === PageType.Task) {
			const form = task[1] as EcaasForm<boolean>;

			if (isFormStarted(form) || form.complete) {
				status = formStatus.inProgress;
			}

			if (form.complete) {
				complete++;
			}

			if (taskPage.excludeFromNavigation?.call(globalThis)) {
				complete++;
			}
		}

		if (taskPage?.type === PageType.TaskGroup) {
			const taskGroupStatus = getSectionStatus(task[1] as Record<string, object>);

			if (taskGroupStatus !== formStatus.notStarted) {
				status = formStatus.inProgress;

			}
			if (taskGroupStatus === formStatus.complete) {
				complete++;
			}
		}

		if (taskPage?.type === PageType.Section) {
			status = getSectionStatus(task[1] as Record<string, object>);
		}
	});

	if (complete === tasks.length) {
		status = formStatus.complete;
	}

	return status;
}

function isFormStarted(form: EcaasForm<boolean>): boolean {
	return (
		form.data &&
    (Array.isArray(form.data)
    	? !!form.data.length
    	: !!Object.entries(form.data).length)
	);
}
