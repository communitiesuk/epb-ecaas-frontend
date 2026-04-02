<script setup lang="ts">
import type * as z from "zod";
import { zodTypeAsFormKitValidation } from "~/utils/zodToFormKitValidation";

defineProps<{
	id?: string,
	name?: string;
	label?: string;
	help?: string;
	zod: z.ZodType;
}>();

</script>

<template>
	<FormKit
		:id="id ?? 'surfaceAreaOfElement'"
		:label="label ?? 'Net surface area'"
		type="govInputWithSuffix"
		suffix-text="m²"
		:name="name ?? 'surfaceAreaOfElement'"
		:help="help"
		:validation="zodTypeAsFormKitValidation(zod)"
		data-field="Zone.BuildingElement.*.area"
	/>
</template>