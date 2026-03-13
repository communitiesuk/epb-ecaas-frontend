<script setup lang="ts">
defineProps<{
	id?: string;
	name?: string;
	label?: string;
}>();
const colourOptions = colourOptionsMap;
</script>

<template>
	<FormKit
		:id="id ?? 'colour'"
		type="govRadios"
		:label="label ?? 'Colour of external surface'"
		:name="name ?? 'colour'"
		:options="colourOptions"
		validation="required"
		data-field="Zone.BuildingElement.*.colour"
	/>
</template>