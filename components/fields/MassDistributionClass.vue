<script setup lang="ts">
import { MassDistributionClass } from '~/schema/api-schema.types';

defineProps<{
	id: string,
	name: string;
	label?: string;
	help?: string;
}>();
</script>

<template>
	<FormKit
		:id="id"
		type="govRadios"
		:options="{
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
		}"
		:label="label ?? 'Mass distribution class'"
		:help="help ?? 'Distribution of mass in building element'"
		:name="name"
		validation="required">
		<div class="govuk__custom-link">
			<a href="/guidance/mass-distribution-guidance" target="_blank" class="govuk-link govuk-link-text">Guidance (opens in another window)</a>	
		</div>
	</FormKit>
</template>

<style lang="scss" scoped>

.govuk__custom-link {
	padding-bottom: 30px;
	font-size: 1.1875rem;
}

</style>