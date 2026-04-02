<script setup lang="ts">

defineProps<{
	id?: string,
	name?: string;
	label?: string;
	help?: string;
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
		validation="required | number | min:0 | max:10000"
		data-field="Zone.BuildingElement.*.area"
	/>
</template>