import type { SummarySection } from "~/common.types";

export function getTabItems(sections: SummarySection[]) {
	return sections.map(x => {
		return {
			id: x.id,
			label: x.label,
		};
	});
};