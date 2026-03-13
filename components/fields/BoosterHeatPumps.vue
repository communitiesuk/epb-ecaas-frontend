<script setup lang="ts">
import { getUrl } from "#imports";
import type { PageId } from "~/data/pages/pages";

defineProps<{
	id: string;
	name: string;
	label: string;
	help?: string;
	section: PageId;
	validation?: string;
}>();

const store = useEcaasStore();

const { heatSource } = store.spaceHeating;
const { heatSources: dhwHeatSources } = store.domesticHotWater;

const boosterHeatPumps = heatSource.data.filter(({ data: x }) => x.typeOfHeatSource === "heatPump" && "typeOfHeatPump" in x && x.typeOfHeatPump === "booster");
const dhwBoosterHeatPumps = dhwHeatSources.data.filter(({ data: x }) => x.heatSourceId === "NEW_HEAT_SOURCE" && x.isExistingHeatSource === false && x.typeOfHeatSource === "heatPump" && x.typeOfHeatPump === "booster");
const boosters = [boosterHeatPumps, dhwBoosterHeatPumps].flat();
const radioOptions = [
	boosters.map(({ data: x }) => x ? [x.id, (x as { name: string }).name] as [string, string] : undefined),
].flat().filter(x => typeof x !== "undefined");
</script>

<template>
	<ClientOnly>
		<FormKit
			:id="id"
			type="govRadios"
			:options="new Map(radioOptions)"
			:label="label"
			:help="help"
			:name="name"
			:validation="validation ?? 'required'">
			<div v-if="!radioOptions.length"
			>
				<p class="govuk-error-message">No booster heat pumps added.</p>
				<NuxtLink :to="getUrl(section)" class="govuk-link gov-radios-add-link">
					Click here to add a booster heat pump
				</NuxtLink>
			</div>
		</FormKit>
	</ClientOnly>
</template>