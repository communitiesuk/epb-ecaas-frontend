<script setup lang="ts">
import type { SchemaCombustionAirSupplySituation } from "~/schema/api-schema.types";

defineProps<{
	id: string,
	name: string;
}>();

const options: Record<SchemaCombustionAirSupplySituation, SnakeToSentenceCase<SchemaCombustionAirSupplySituation>> = {
	room_air: "Room air",
	outside: "Outside"
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
	/>
</template>