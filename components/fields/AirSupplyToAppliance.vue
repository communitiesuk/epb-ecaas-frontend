<script setup lang="ts">
import type { SchemaCombustionAirSupplySituation } from "~/schema/aliases";

defineProps<{
	id: string,
	name: string;
}>();

const options: Record<SchemaCombustionAirSupplySituation, SnakeToSentenceCase<SchemaCombustionAirSupplySituation>> = {
	room_air: "Room air",
	outside: "Outside",
};

</script>

<template>
	<FormKit
		:id="id"
		type="govRadios"
		label="Air supply to appliance"
		:name="name"
		validation="required"
		:options="options"
		data-field="supply_situation"
	/>
</template>