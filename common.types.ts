import type { SummaryData } from "./components/GovSummaryList.vue";

export interface GovTagProps {
	text: string;
	color?: string;
}

export interface SummarySection {
	id: string;
	label: string;
	data: SummaryData | SummaryData[];
	editUrl: string;
}