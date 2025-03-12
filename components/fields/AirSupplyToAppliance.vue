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
		label="Air supply to appliance"
		:name="name"
		validation="required"
		:options="{ roomAir: 'Room air', outside: 'Outside' }"
	/>
</template>