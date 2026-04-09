<script lang="ts" setup>
const props = defineProps<{
	field?: string;
	label?: string;
	help?: string;
	minmax?: MinMax;
}>();

interface MinMax {
	min: number;
	max: number;
}

let min: number | undefined;
let max: number | undefined;
if (props.minmax) {
	const { min: minParam, max: maxParam } = props.minmax;
	min = minParam;
	max = maxParam;
}

</script>

<template>
	<FormKit
		:id="field ?? 'elevationalHeight'"
		type="govInputWithSuffix"
		suffix-text="m"
		:label="label ?? 'Elevational height of building element at its base'"
		:help="help ?? 'Enter the distance between the ground and the lowest edge of the element'"
		:name="field ?? 'elevationalHeight'"
		:validation="`required | number | min:${ min ?? 0 } | max:${ max ?? 500 }`"
		data-field="Zone.BuildingElement.*.base_height"
	/>
</template>