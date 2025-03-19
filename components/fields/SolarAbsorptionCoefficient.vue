<script setup lang="ts">
defineProps<{
	id: string,
	name: string;
}>();
</script>

<template>
	<FormKit
		:id="id"
		type="govInputFloat"
		label="Solar absorption coefficient"
		help="Solar absorption coefficient at the external surface (dimensionless), the proportion of solar radiation which is absorbed. Decimal between 0-1."
		:name="name"
		validation="required | number | min:0.01 | max:1">
		<GovDetails summary-text="Help with this input">
			<p>
				<span class="govuk-!-font-weight-bold">0.3</span><br>
				Light colour
			</p>
			<p>
				<span class="govuk-!-font-weight-bold">0.6</span><br>
				Intermediate colour
			</p>
			<p>
				<span class="govuk-!-font-weight-bold">0.9</span><br>
				Dark colour
			</p>
		</GovDetails>
	</FormKit>
</template>