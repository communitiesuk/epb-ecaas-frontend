<script setup lang="ts">
import { getUrl } from "#imports";

defineProps<{
	id: string;
	name: string;
	label: string;
	help?: string;
	validation?: string;
	validationRules?: Record<string, (node: FormKitNode) => boolean>;
	validationMessages?: Record<string, string>;
	dataField?: string;
}>();

const store = useEcaasStore();

const hotWaterHeatSources = store.domesticHotWater.heatSources.data;
const spaceHeatingHeatSources = store.spaceHeating.heatSource.data;

const heatSourceOptions = [
	hotWaterHeatSources.map(x => {
		if (x.data.isExistingHeatSource) {
			const heatSource = spaceHeatingHeatSources.find(source => source.data.id === x.data.heatSourceId);

			if (heatSource) {
				return [x.data.id, heatSource.data.name] as [string, string];
			}

			return undefined;
		}

		return [x.data.id, x.data.name] as [string, string];
	}),
].flat().filter(x => typeof x !== "undefined");
</script>

<template>
	<ClientOnly>
		<FormKit
			:id="id"
			type="govRadios"
			:options="new Map(heatSourceOptions)"
			:label="label"
			:help="help"
			:name="name"
			:validation="validation ?? 'required'"
			:validation-rules="validationRules"
			:validation-messages="validationMessages"
			:data-field="dataField">
			<div v-if="!heatSourceOptions.length"
			>
				<p class="govuk-error-message">No heat sources added.</p>
				<NuxtLink :to="getUrl('heatSourceCreate')" class="govuk-link gov-radios-add-link">
					Click here to add a heat source
				</NuxtLink>
			</div>
		</FormKit>
	</ClientOnly>
</template>