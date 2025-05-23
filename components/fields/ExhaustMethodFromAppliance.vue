<script setup lang="ts">
import { FlueGasExhaustSituation } from '~/schema/api-schema.types';
import type { FlueGasExhaustSituationDisplay } from '~/utils/display';

defineProps<{
	id: string,
	name: string,
}>();

const exhaustMethodOptions: Record<FlueGasExhaustSituation, FlueGasExhaustSituationDisplay> = {
	[FlueGasExhaustSituation.into_room]: 'Into room',
	[FlueGasExhaustSituation.into_separate_duct]: 'Into separate duct',
	[FlueGasExhaustSituation.into_mech_vent]: 'Into mechanical vent',
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