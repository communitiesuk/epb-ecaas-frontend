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
		:options="{
			internal: {
				label: 'Mass concentrated on internal side',
				hint: 'Construction with external thermal insulation (main mass component near inside surface), or equivalent'
			},
			external: {
				label: 'Mass concentrated on external side',
				hint: 'Construction with internal thermal insulation (main mass component near outside surface), or equivalent'
			},
			divided: {
				label: 'Mass divided over internal and external side',
				hint: 'Construction with thermal insulation in between two main mass components, or equivalent'
			},
			equally: {
				label: 'Mass equally distributed',
				hint: 'Uninsulated construction (e.g. solid or hollow bricks, heavy or lightweight concrete, or lightweight construction with negligible mass (e.g. steel sandwich panel), or equivalent'
			},
			inside: {
				label: 'Mass concentrated inside',
				hint: 'Construction with both internal and external insulation (main mass component concentrated near centre of construction), or equivalent'
			},
		}"
		label="Mass distribution class"
		help="Distribution of mass in building element"
		:name="name"
		validation="required"
	/>
</template>