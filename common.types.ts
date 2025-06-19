import type { SummaryData } from "./components/SummaryList.vue";

export interface GovTagProps {
	text: 'Not started' | 'In progress' | 'Complete';
	color: 'grey' | 'yellow' | 'green';
}

export interface SummarySection {
	id: string;
	label: string;
	data: SummaryData | SummaryData[];
	editUrl: string;
}