<script setup lang="ts">
defineProps<{
	id: string,
	name: string;
	label?: string;
	help?: string;
}>();
</script>

<template>
	<FormKit
		:id="id"
		type="govInputWithSuffix"
		suffix-text="W/(m²·K)"
		:label="label ?? 'U-value'"
		:help="help ?? 'This is the steady thermal transmittance of the building element'"
		:name="name"
		validation="required | number | min:0.01 | max:10"
	/>
</template>