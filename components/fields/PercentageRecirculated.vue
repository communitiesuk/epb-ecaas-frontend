<script setup lang="ts">
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
		:validation="'required | number | min:0 | max:100'"
		:label="label ?? 'Percentage recirculated'"
		:help="help" />
</template>