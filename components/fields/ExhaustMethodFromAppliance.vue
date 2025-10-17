<script setup lang="ts">
import type { SchemaFlueGasExhaustSituation } from "~/schema/aliases";
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
		data-field="InfiltrationVentilation.CombustionAppliances.*.exhaust_situation"
	/>
</template>