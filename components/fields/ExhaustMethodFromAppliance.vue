<script setup lang="ts">
import type { SchemaFlueGasExhaustSituation } from "~/schema/api-schema.types";
import type { FlueGasExhaustSituationDisplay } from "~/utils/display";

defineProps<{
	id: string,
	name: string,
}>();

const exhaustMethodOptions: Record<SchemaFlueGasExhaustSituation, FlueGasExhaustSituationDisplay> = {
	into_room: "Into room",
	into_separate_duct: "Into separate duct",
	into_mech_vent: "Into mechanical vent",
};
</script>

<template>
	<FormKit
		:id="id"
		type="govRadios"
		label="Exhaust method from appliance"
		:name="name"
		validation="required"
		:options="exhaustMethodOptions"
	/>
</template>