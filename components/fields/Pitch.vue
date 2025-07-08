<script setup lang="ts">
defineProps<{
	id?: string;
	name?: string;
	label?: string;
	pitchOption?: string;
	options?: Record<string, string>
}>();

const help = 'Tilt angle of the surface from horizontal, between 0 and 180, where 0 means the external surface is facing up, 90 means the external surface is vertical and 180 means the external surface is facing down';

</script>

<template>
	<template v-if="options">
		<FormKit
			id="pitchOption" type="govRadios" :options="options" :label="label ?? 'Pitch'" name="pitchOption"
			validation="required">
			<p class="govuk-body">
				<a href="/guidance/pitch" target="_blank" class="govuk-link">
					Guidance on pitch (opens in another window)
				</a>
			</p>
			<GovDetails summary-text="Help with this input">
				<p class="govuk-hint">
					180 = floors<br>
					0 = ceilings
				</p>
				<p>{{ help }}</p>
				<TablesPitch/>
			</GovDetails>
		</FormKit>
		<FormKit
			v-if="pitchOption === 'custom'" :id="id ?? 'pitch'" type="govInputWithSuffix" suffix-text="°"
			:name="name ?? 'pitch'" validation="required | number | min:0 | max:180" />
	</template>
	<FormKit
		v-else :id="id ?? 'pitch'" type="govInputWithSuffix" :label="label ?? 'Pitch'" :name="name ?? 'pitch'"
		validation="required | number | min:0 | max:180" suffix-text="°">
		<p class="govuk-body">
			<a href="/guidance/pitch" target="_blank" class="govuk-link">
				Guidance on pitch (opens in another window)
			</a>
		</p>
		<GovDetails summary-text="Help with this input">
			<p>{{ help }}</p>
			<p class="govuk-hint">
				180 = floors<br>
				0 = ceilings
			</p>
			<TablesPitch/>
		</GovDetails>
	</FormKit>
</template>