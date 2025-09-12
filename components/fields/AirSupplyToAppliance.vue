<script setup lang="ts">
import type { CombustionAirSupplySituation } from "~/schema/api-schema.types";

defineProps<{
	id: string,
	name: string;
}>();

const options: Record<CombustionAirSupplySituation, SnakeToSentenceCase<CombustionAirSupplySituation>> = {
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
	/>
</template>