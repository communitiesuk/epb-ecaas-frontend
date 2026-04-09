<script setup lang="ts">
import { getUrl } from "#imports";
import { useEnergySupplies } from "~/composables/energySupplies";

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

const energySupplies = useEnergySupplies();

function getDefaultEnergySupply(supplies: [string, string][]) {
	if (supplies.length === 1) {
		return supplies[0]![0];
	}
}
</script>

<template>
	<ClientOnly>
		<FormKit
			:id="id"
			type="govRadios"
			:options="new Map(energySupplies)"
			:label="label"
			:help="help"
			:name="name"
			:value="getDefaultEnergySupply(energySupplies)"
			:validation="validation ?? 'required'"
			:validation-rules="validationRules"
			:validation-messages="validationMessages"
		>
			<div v-if="!energySupplies.length"
			>
				<p class="govuk-error-message">No energy supplies added.</p>
				<NuxtLink :to="getUrl('generalSpecifications')" class="govuk-link gov-radios-add-link">
					Click here to add an energy supply
				</NuxtLink>
			</div>
		</FormKit>
	</ClientOnly>
</template>