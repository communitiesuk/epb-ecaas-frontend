import type { HookResult } from "nuxt/schema";
import type { SummaryData } from "./components/SummaryList.vue";

export interface GovTagProps {
	text: "Not started" | "In progress" | "Complete";
	color: "grey" | "yellow" | "green";
	testId?: string;
}

export interface SummarySection {
	id: string;
	label: string;
	data: SummaryData | SummaryData[];
	editUrl: string;
}

declare module "#app" {
	interface RuntimeNuxtHooks {
		"app:floor:removed": (id: string) => HookResult,
		"app:floor:updated": (floor: GroundFloorData | FloorAboveUnheatedBasementData) => HookResult,
	}
}