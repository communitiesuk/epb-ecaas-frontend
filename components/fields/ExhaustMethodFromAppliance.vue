<script setup lang="ts">
defineProps<{
	id: string,
	name: string,
}>();
</script>

<template>
	<FormKit
		:id="id"
		type="govRadios"
		label="Exhaust method from appliance"
		:name="name"
		validation="required"
		:options="{
			intoRoom: 'Into room',
			intoSeparateDuct: 'Into separate duct',
			intoMechanicalVent: 'Into mechanical vent',
		}"
	/>
</template>