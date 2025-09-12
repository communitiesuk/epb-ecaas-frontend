import type { GovTagProps } from "~/common.types";

export interface FormStatus {
	readonly notStarted: GovTagProps;
	readonly inProgress: GovTagProps;
	readonly complete: GovTagProps;
}

const formStatus: FormStatus = {
	notStarted: {
		text: "Not started",
		color: "grey",
	},
	inProgress: {
		text: "In progress",
		color: "yellow",
	},
	complete: {
		text: "Complete",
		color: "green",
	},
};

export default formStatus;