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
}>();

// const { getStoreIndex } = useForm();

const store = useEcaasStore();

const { data } = store.spaceHeating.heatSource; 

const boilers = data !== undefined ?
	[...new Set([...data])]
		.filter(x => x.data.typeOfHeatSource === "boiler")
		.map(x => [x.data.id, x.data.name] as [string, string])
	: [];

</script>

<template>
	<ClientOnly>
		<FormKit
			:id="id"
			type="govRadios"
			:options="new Map(boilers)"
			:label="label"
			:help="help"
			:name="name"
			:validation="validation ?? 'required'"
			:validation-rules="validationRules"
			:validation-messages="validationMessages"
		>
			<div v-if="!boilers.length">
				<p class="govuk-error-message">No boilers added.</p>
				<NuxtLink :to="getUrl('generalSpecifications')" class="govuk-link gov-radios-add-link">
					Click here to add a boiler
				</NuxtLink>
			</div>
		</FormKit>
	</ClientOnly>
</template>