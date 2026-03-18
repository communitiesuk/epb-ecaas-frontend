<script setup lang="ts">
import { getUrl } from "#imports";
import type { PageId } from "~/data/pages/pages";

const props = defineProps<{
	id: string;
	name: string;
	label: string;
	help?: string;
	section: PageId;
	validation?: string;
}>();

const store = useEcaasStore();

const { heatSource: spaceHeatingHeatSources } = store.spaceHeating;
const { heatSources: dhwHeatSources } = store.domesticHotWater;

const spaceHeatingBoosters = spaceHeatingHeatSources.data
	.filter(({ data: x }) => 
		x.typeOfHeatSource === "heatPump"
		&& "typeOfHeatPump" in x
		&& x.typeOfHeatPump === "booster");

const dhwBoosters = dhwHeatSources.data
	.filter(({ data: x }) =>
		x.heatSourceId === "NEW_HEAT_SOURCE"
		&& x.isExistingHeatSource === false
		&& x.typeOfHeatSource === "heatPump"
		&& "typeOfHeatPump" in x
		&& x.typeOfHeatPump === "booster");

const boosters = [spaceHeatingBoosters, dhwBoosters].flat();

const spaceHeatingOptions = spaceHeatingBoosters
	.map(({ data: x }) => x ? [x.id, (x as { name: string }).name] as [string, string] : undefined)
	.filter(x => typeof x !== "undefined");

const DHWAndSpaceHeatingOptions = boosters
	.map(({ data: x }) => x ? [x.id, (x as { name: string }).name] as [string, string] : undefined)
	.filter(x => typeof x !== "undefined");

const radioOptions = props.section === "spaceHeating" ? spaceHeatingOptions : DHWAndSpaceHeatingOptions;

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
			:validation="validation ?? 'required'"
		>
			<div v-if="!radioOptions.length">
				<p class="govuk-error-message">No booster heat pumps added.</p>
				<NuxtLink :to="getUrl(section)" class="govuk-link gov-radios-add-link">
					Click here to add a booster heat pump
				</NuxtLink>
			</div>
		</FormKit>
	</ClientOnly>
</template>