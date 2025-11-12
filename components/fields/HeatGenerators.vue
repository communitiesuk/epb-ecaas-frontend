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

const { heatPump, boiler, heatBattery, heatNetwork, heatInterfaceUnit } = store.heatingAndCoolingSystems.heatGeneration;

const heatGenerators = [
	heatPump.data.map(x => x ? [x.data.id, x.data.name] as [string, string] : undefined),
	boiler.data.map(x => x ? [x.id, x.name] as [string, string] : undefined),
	heatBattery.data.map(x => x ? [x.id, x.name] as [string, string]: undefined),
	heatNetwork.data.map(x => x ? [x.id, x.name] as [string, string] : undefined),
	heatInterfaceUnit.data.map(x => x ? [x.id, x.name] as [string, string]: undefined),
].flat().filter(x => typeof x !== "undefined");
</script>

<template>
	<ClientOnly>
		<FormKit
			:id="id"
			type="govRadios"
			:options="new Map(heatGenerators)"
			:label="label"
			:help="help"
			:name="name"
			:validation="validation ?? 'required'"
			:validation-rules="validationRules"
			:validation-messages="validationMessages"
			:data-field="dataField">
			<div v-if="!heatGenerators.length"
			>
				<p class="govuk-error-message">No heat generators added.</p>
				<NuxtLink :to="getUrl('heatGeneration')" class="govuk-link gov-radios-add-link">
					Click here to add a heat generator
				</NuxtLink>
			</div>
		</FormKit>
	</ClientOnly>
</template>