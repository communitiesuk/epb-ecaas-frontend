<script setup lang="ts">
import { getUrl } from "#imports";

defineProps<{
	id: string;
	name: string;
	label: string;
	help?: string;
	validation?: string;
}>();

const store = useEcaasStore();

const { heatSource } = store.spaceHeating;

const boosterHeatPumps = heatSource.data.filter(({ data: x }) => x.typeOfHeatSource === "heatPump" && "typeOfHeatPump" in x && x.typeOfHeatPump === "booster");

const radioOptions = [
	boosterHeatPumps.map(({ data: x }) => x ? [x.id, x.name] as [string, string] : undefined),
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
				<NuxtLink :to="getUrl('heatSource')" class="govuk-link gov-radios-add-link">
					Click here to add a booster heat pump
				</NuxtLink>
			</div>
		</FormKit>
	</ClientOnly>
</template>