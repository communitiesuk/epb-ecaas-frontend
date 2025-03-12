<script setup lang="ts">
defineProps<{
	id: string,
	name: string;
}>();
</script>

<template>
	<FormKit
		:id="id"
		type="govRadios"
		label="Type of fuel"
		:name="name"
		validation="required"
		:options="{
			wood: 'Wood',
			oil: 'Oil',
			gas: 'Gas',
			coal: 'Coal'
		}"
	/>
</template>