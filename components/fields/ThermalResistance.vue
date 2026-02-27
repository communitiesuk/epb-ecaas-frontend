<script setup lang="ts">
defineProps<{
	id?: string,
	name?: string;
	label?: string;
	help?: string;
}>();
</script>

<template>
	<FormKit
		:id="id ?? 'thermalResistance'"
		type="govInputWithSuffix"
		suffix-text="(m²·K)/W"
		:label="label ?? 'Thermal Resistance'"
		:help="help ?? 'Enter the thermal resistance of the construction of the building element'"
		:name="name ?? 'thermalResistance'"
		validation="required | number | min:0.01 | max:50"
		data-field="Zone.BuildingElement.*.thermal_resistance"
	/>
</template>