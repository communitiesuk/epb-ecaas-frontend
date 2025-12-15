<script setup lang="ts">
import { getUrl } from "#imports";
import type { SchemaFuelType, SchemaFuelTypeExtended } from "~/schema/aliases";

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

const { fuelType } = store.dwellingDetails.generalSpecifications.data; 

const energySupplyOptions = {
	"mains_gas": "Mains gas",
	"lpg_bulk": "LPG (Liquid petroleum gas)",
	"elecOnly": "Electricity"
} as const satisfies Record<SchemaFuelTypeExtended, FuelTypeDisplay | "Electricity">;

const energySupplies = fuelType !== undefined ?
	[...new Set([...fuelType, "elecOnly" as keyof typeof energySupplyOptions])].map( x => {
		return x ? [x, energySupplyOptions[x]] as [string, string] : undefined;
	}).filter(x => typeof x !== "undefined") : [];

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