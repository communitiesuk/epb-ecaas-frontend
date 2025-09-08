<script setup lang="ts">
const props = defineProps<{
	id?: string;
	name?: string;
	label?: string;
	pitchOption?: string;
	options?: Record<string, string>;
	help?: string;
}>();

const helpText = props.help ?? "Enter the tilt angle of the external surface. 0° means the external surface is facing up like ceilings, and 180° means the external surface is facing down like floors.";
</script>

<template>
	<template v-if="options">
		<FormKit
			id="pitchOption"
			type="govRadios"
			:options="options"
			:label="label ?? 'Pitch'"
			:help="helpText"
			name="pitchOption"
			validation="required">
			<GovDetails summary-text="Help with this input">
				<div class="govuk-!-margin-bottom-3">
					<a href="/guidance/pitch" target="_blank" class="govuk-link">
						Guidance on pitch (opens in another window)
					</a>
				</div>
				<TablesPitch/>
			</GovDetails>
		</FormKit>
		<FormKit
			v-if="pitchOption === 'custom'"
			:id="id ?? 'pitch'"
			type="govInputWithSuffix"
			suffix-text="°"
			:name="name ?? 'pitch'"
			validation="required | number | min:0 | max:180"
		/>
	</template>
	<FormKit
		v-else
		:id="id ?? 'pitch'"
		type="govInputWithSuffix"
		:label="label ?? 'Pitch'"
		:help="helpText"
		:name="name ?? 'pitch'"
		validation="required | number | min:0 | max:180"
		suffix-text="°">
		<GovDetails summary-text="Help with this input">
			<a href="/guidance/pitch" target="_blank" class="govuk-link">
				Guidance on pitch (opens in another window)
			</a>
			<TablesPitch/>
		</GovDetails>
	</FormKit>
</template>