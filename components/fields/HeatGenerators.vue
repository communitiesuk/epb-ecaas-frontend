<script setup lang="ts">
import { getUrl } from '#imports';

defineProps<{
	id: string;
	name: string;
	label: string;
	help?: string;
}>();

const store = useEcaasStore();

const { heatPump, boiler, heatBattery, heatNetwork, heatInterfaceUnit } = store.heatingSystems.heatGeneration;

const heatGenerators = [
	heatPump.data.map((x, i) => [`heatPump_${i}`, x.name] as [string, string]),
	boiler.data.map((x, i) => [`boiler_${i}`, x.name] as [string, string]),
	heatBattery.data.map((x, i) => [`heatBattery_${i}`, x.name] as [string, string]),
	heatNetwork.data.map((x, i) => [`heatNetwork_${i}`, x.name] as [string, string]),
	heatInterfaceUnit.data.map((x, i) => [`heatInterfaceUnit_${i}`, x.name] as [string, string])
].flat();
</script>

<template>
	<FormKit
		:id="id"
		type="govRadios"
		:options="new Map(heatGenerators)"
		:label="label"
		:help="help"
		:name="name"
		validation="required">
		<div v-if="!heatGenerators.length">
			<p class="govuk-error-message">No heat generators added.</p>
			<NuxtLink :to="getUrl('heatGeneration')" class="govuk-link gov-radios-add-link">
				Click here to add a heat generator
			</NuxtLink>
		</div>
	</FormKit>
</template>