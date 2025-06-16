<script setup lang="ts">
import { getUrl } from '#imports';

defineProps<{
	id: string;
	name: string;
	label: string;
	help?: string;
	validation?: string;
	validationRules?: Record<string, (node: FormKitNode) => boolean>;
	validationMessages?: Record<string, string>;
}>();

const store = useEcaasStore();

const { heatPump, boiler, heatBattery, heatNetwork, heatInterfaceUnit } = store.heatingSystems.heatGeneration;

const heatGenerators = [
	heatPump.data.map(x => [x.id, x.name] as [string, string]),
	boiler.data.map(x => [x.id, x.name] as [string, string]),
	heatBattery.data.map(x => [x.id, x.name] as [string, string]),
	heatNetwork.data.map(x => [x.id, x.name] as [string, string]),
	heatInterfaceUnit.data.map(x => [x.id, x.name] as [string, string])
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
		:validation="validation ?? 'required'"
		:validation-rules="validationRules"
		:validation-messages="validationMessages">
		<div v-if="!heatGenerators.length">
			<p class="govuk-error-message">No heat generators added.</p>
			<NuxtLink :to="getUrl('heatGeneration')" class="govuk-link gov-radios-add-link">
				Click here to add a heat generator
			</NuxtLink>
		</div>
	</FormKit>
</template>