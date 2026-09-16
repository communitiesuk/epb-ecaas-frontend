<script setup lang="ts">
import { percentageRecirculatedZod } from "~/stores/ecaasStore.schema";

defineProps<{
	id?: string;
	name?: string;
	label?: string;
	help?: string;
}>();
</script>

<template>
	<FormKit
		:id="id ?? 'percentageRecirculated'"
		:name="name ?? 'percentageRecirculated'"
		type="govInputWithSuffix"
		:suffix-text="'%'"
		:validation="zodTypeAsFormKitValidation(percentageRecirculatedZod)"
		:label="label ?? 'Percentage recirculated'"
		:help="help" />
</template>