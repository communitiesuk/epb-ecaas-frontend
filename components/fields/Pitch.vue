<script setup lang="ts">

const props = defineProps<{
	id?: string;
	name?: string;
	label?: string;
	pitchOption?: string;
	options?: Record<string, string>;
	help?: string;
	suppressStandardGuidance?: boolean,
	customPitchRange?: [number, number],
	dataField?: string;
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
			validation="required"
			:data-field="dataField">
			<GovDetails summary-text="Help with this input" v-if="!suppressStandardGuidance">
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
			:validation="`required | number | ${ customPitchRange ? `min:${customPitchRange[0]} | max:${customPitchRange[1]}` : 'min:0 | max:180' }`"
			:data-field="dataField"
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
		suffix-text="°"
		:data-field="dataField">
		<GovDetails summary-text="Help with this input">
			<a href="/guidance/pitch" target="_blank" class="govuk-link">
				Guidance on pitch (opens in another window)
			</a>
			<TablesPitch/>
		</GovDetails>
	</FormKit>
</template>