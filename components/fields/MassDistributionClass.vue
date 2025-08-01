<script setup lang="ts">
import { MassDistributionClass } from '~/schema/api-schema.types';
import type { RadioOption } from '../form-kit/Radios.vue';

defineProps<{
	id?: string,
	name?: string;
	label?: string;
	help?: string;
}>();

const options: Record<MassDistributionClass, RadioOption> = {
	[MassDistributionClass.I]: {
		label: 'Mass concentrated on internal side',
		hint: 'Construction with external thermal insulation (main mass component near inside surface), or equivalent'
	},
	[MassDistributionClass.E]: {
		label: 'Mass concentrated on external side',
		hint: 'Construction with internal thermal insulation (main mass component near outside surface), or equivalent'
	},
	[MassDistributionClass.IE]: {
		label: 'Mass divided over internal and external side',
		hint: 'Construction with thermal insulation in between two main mass components, or equivalent'
	},
	[MassDistributionClass.D]: {
		label: 'Mass equally distributed',
		hint: 'Uninsulated construction (e.g. solid or hollow bricks, heavy or lightweight concrete, or lightweight construction with negligible mass (e.g. steel sandwich panel), or equivalent'
	},
	[MassDistributionClass.M]: {
		label: 'Mass concentrated inside',
		hint: 'Construction with both internal and external insulation (main mass component concentrated near centre of construction), or equivalent'
	},
};

</script>

<template>
	<FormKit
		:id="id ?? 'massDistributionClass'"
		type="govRadios"
		:options="options"
		:label="label ?? 'Mass distribution class'"
		:help="help ?? 'This is the distribution of mass in the building element'"
		:name="name ?? 'massDistributionClass'"
		validation="required">
		<GovDetails summary-text="Help with this input">
			<a href="/guidance/mass-distribution-guidance" target="_blank" class="govuk-link">Guidance on mass distribution (opens in another window)</a>	
		</GovDetails>
	</FormKit>
</template>

<style lang="scss" scoped>

.govuk__custom-link {
	padding-bottom: 30px;
	font-size: 1.1875rem;
}

</style>