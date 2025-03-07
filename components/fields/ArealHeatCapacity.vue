<script setup lang="ts">
defineProps<{
	id: string,
	name: string;
}>();
</script>

<template>
	<FormKit
		:id="id"
		type="govInputWithSuffix"
		suffix-text="J/m²·K"
		label="Areal heat capacity"
		help="Effective areal heat capacity or kappa value. This is the total heat capacity of all the construction layers, that is, the sum of the heat capacities of each individual layers. (Note that this is different to the effectiveness thickness definition of areal heat capacity used in SAP10 and in other monthly models.)"
		:name="name"
		validation="required | number | min:100 | max:5000000">
		<GovDetails summary-text="Help with this input">
			<p><strong>20,000-40,000 J/m2.K</strong></p>
			<p>(e.g., lightweight timber frame, minimal thermal mass)</p>
			<p><strong>40,000-60,000 J/m2.K</strong></p>
			<p>(e.g., timber with some internal thermal mass like plasterboard)</p>
			<p><strong>60,000-100,000 J/m2.K</strong></p>
			<p>(e.g., standard brick/block construction with moderate thermal mass)</p>
			<p><strong>100,000-150,000 J/m2.K</strong></p>
			<p>(e.g., brick/block with concrete floors, significant thermal mass)</p>
			<p><strong>~150,000+ J/m2.K</strong></p>
			<p>(e.g., concrete or stone with thick internal walls and floors)</p>
		</GovDetails>
	</FormKit>
</template>