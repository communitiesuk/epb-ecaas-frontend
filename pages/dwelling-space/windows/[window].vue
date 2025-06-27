<script setup lang="ts">
import { pitchOptions } from '#imports';
import { WindowTreatmentControl, WindowTreatmentType } from '~/schema/api-schema.types';

const title = "Window";
const store = useEcaasStore();
const { saveToList } = useForm();

const window = useItemToEdit('window', store.dwellingFabric.dwellingSpaceWindows.data);
const model: Ref<WindowData> = ref(window!);

const windowTreatmentTypeOptions: Record<WindowTreatmentType, SnakeToSentenceCase<WindowTreatmentType>> = {
	curtains: 'Curtains',
	blinds: 'Blinds',
};
const curtainsControlObjectOptions: Record<Exclude<WindowTreatmentControl, 'manual_motorised' | 'combined_light_blind_HVAC'>, string> = {
	[WindowTreatmentControl.auto_motorised]: 'Auto motorised',
	[WindowTreatmentControl.manual]: 'Manual',
};

const saveForm = (fields: WindowData) => {
	store.$patch((state) => {
		const { dwellingSpaceWindows } = state.dwellingFabric;

		const commonFields = {
			name: fields.name,
			orientation: fields.orientation,
			surfaceArea: fields.surfaceArea,
			height: fields.height,
			width: fields.width,
			uValue: fields.uValue,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === '90' ? 90 : fields.pitch,
			solarTransmittance: fields.solarTransmittance,
			elevationalHeight: fields.elevationalHeight,
			midHeight: fields.midHeight,
			frameToOpeningRatio: fields.frameToOpeningRatio,
			overhangDepth: 'overhangDepth' in fields ? fields.overhangDepth : undefined,
			overhangDistance: 'overhangDepth' in fields ? fields.overhangDistance: undefined,
			sideFinRightDepth: 'sideFinRightDepth' in fields ? fields.sideFinRightDepth : undefined,
			sideFinRightDistance: 'sideFinRightDepth' in fields ? fields.sideFinRightDistance : undefined,
			sideFinLeftDepth: 'sideFinLeftDepth' in fields ? fields.sideFinLeftDepth : undefined,
			sideFinLeftDistance: 'sideFinLeftDepth' in fields ? fields.sideFinLeftDistance : undefined,
		};

		let commonFieldsIncludingOpenableParts;

		const numberParts = fields.numberOpenableParts;

		switch (numberParts) {
			case '0':
				commonFieldsIncludingOpenableParts = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
				};
				break;
			case '1':
				commonFieldsIncludingOpenableParts = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					maximumOpenableArea: fields.maximumOpenableArea,
					heightOpenableArea: fields.heightOpenableArea,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
				};
				break;
			case '2':
				commonFieldsIncludingOpenableParts = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					maximumOpenableArea: fields.maximumOpenableArea,
					heightOpenableArea: fields.heightOpenableArea,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
					midHeightOpenablePart2: fields.midHeightOpenablePart2,
				};
				break;
			case '3':
				commonFieldsIncludingOpenableParts = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					maximumOpenableArea: fields.maximumOpenableArea,
					heightOpenableArea: fields.heightOpenableArea,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
					midHeightOpenablePart2: fields.midHeightOpenablePart2,
					midHeightOpenablePart3: fields.midHeightOpenablePart3,
				};
				break;
			case '4':
				commonFieldsIncludingOpenableParts = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					maximumOpenableArea: fields.maximumOpenableArea,
					heightOpenableArea: fields.heightOpenableArea,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
					midHeightOpenablePart2: fields.midHeightOpenablePart2,
					midHeightOpenablePart3: fields.midHeightOpenablePart3,
					midHeightOpenablePart4: fields.midHeightOpenablePart4,
				};
				break;
			default:
				commonFieldsIncludingOpenableParts = { ...commonFields } as WindowData;
				break;
		}

		let window: WindowData;

		if (fields.treatmentType) {
			window = {
				...commonFieldsIncludingOpenableParts,
				treatmentType: fields.treatmentType,
				thermalResistivityIncrease: fields.thermalResistivityIncrease,
				solarTransmittanceReduction: fields.solarTransmittanceReduction,
			};
			if (fields.treatmentType === WindowTreatmentType.curtains) {
				window = {
					...window,
					curtainsControlObject: fields.curtainsControlObject,
				};
			}
		} else {
			window = {
				...commonFieldsIncludingOpenableParts,
			};
		}

		saveToList(window, dwellingSpaceWindows);
	});
	store.dwellingFabric.dwellingSpaceWindows.complete = false;
	navigateTo("/dwelling-space/windows");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<FormKit
		v-model="model" type="form" :actions="false" :incomplete-message="false" @submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="windowErrorSummary" />
		<FormKit
			id="name" type="govInputText" label="Name"
			help="Provide a name for this element so that it can be identified later" name="name" validation="required" />
		<FieldsPitch
			:pitch-option="model.pitchOption"
			:options="pitchOptions()"
		/>
		<FieldsOrientation />
		<FormKit
			id="height" type="govInputWithSuffix" suffix-text="m" label="Height"
			help="The height of the building element" name="height" validation="required | number | min:0.001 | max:50" />
		<FormKit
			id="width" type="govInputWithSuffix" suffix-text="m" label="Width" help="The width of the building element"
			name="width" validation="required | number | min:0.001 | max:50" />
		<FieldsElevationalHeight />
		<FormKit
			id="surfaceArea" type="govInputWithSuffix" suffix-text="m²" label="Net surface area"
			help="Net area of the building element. For non-rectangular windows, use the area of the window based on its shape"
			name="surfaceArea" validation="required | number | min:0.01 | max:10000" />
		<FormKit
			id="uValue" type="govInputWithSuffix" suffix-text="W/(m²·K)" label="U-value"
			help="Steady-state thermal transmittance of the building element" name="uValue"
			validation="required | number | min:0.01 | max:10" />
		<FormKit
			id="solarTransmittance" type="govInputFloat" label="Transmittance of solar energy "
			help="G value. Total solar energy transmittance of the transparent part of the window. Decimal between 0-1"
			name="solarTransmittance" validation="required | number | min:0.01 | max:1" />
		<FormKit
			id="midHeight" type="govInputWithSuffix" suffix-text="m" label="Mid height"
			help="Enter the height from the ground to the midpoint of the window" name="midHeight"
			validation="required | number | min:0 | max:100" />
		<FormKit
			id="frameToOpeningRatio" type="govInputFloat" label="Frame to opening ratio"
			help="The proportion of the window area occupied by the frame, expressed as a decimal (e.g., 0.2)"
			name="frameToOpeningRatio" validation="required | number | min:0 | max:100" />
		<FormKit
			id="numberOpenableParts" type="govRadios" :options="{
				1: '1',
				2: '2',
				3: '3',
				4: '4',
				0: 'None',
			}" label="Number of openable parts " name="numberOpenableParts" validation="required" />
		<template v-if="!!model.numberOpenableParts && model.numberOpenableParts !== '0'">
			<FormKit
				id="heightOpenableArea" type="govInputWithSuffix" suffix-text="m" label="Height of the openable area"
				help="The vertical measurement of the section of the window that can be opened"
				name="heightOpenableArea" validation="required | number | min:0 | max:100" />
			<FormKit
				id="maximumOpenableArea" type="govInputWithSuffix" suffix-text="m²" label="Maximum openable area"
				help="The total area of the window that can be opened for ventilation." name="maximumOpenableArea"
				validation="required | number | min:0 | max:100" />
			<FormKit
				id="midHeightOpenablePart1" type="govInputWithSuffix" suffix-text="m"
				label="Mid height of the air flow path for openable part 1 "
				help="Enter the height from the ground to the midpoint of the openable section of the window"
				name="midHeightOpenablePart1"
				validation="required | number | min:0 | max:100" />
			<template v-if="model.numberOpenableParts !== '1'">
				<FormKit
					id="midHeightOpenablePart2" type="govInputWithSuffix" suffix-text="m"
					label="Mid height of the air flow path for openable part 2 "
					help="Enter the height from the ground to the midpoint of the openable section of the window"
					name="midHeightOpenablePart2"
					validation="required | number | min:0 | max:100" />
				<template v-if="model.numberOpenableParts !== '2'">
					<FormKit
						id="midHeightOpenablePart3" type="govInputWithSuffix" suffix-text="m"
						label="Mid height of the air flow path for openable part 3 "
						help="Enter the height from the ground to the midpoint of the openable section of the window"
						name="midHeightOpenablePart3"
						validation="required | number | min:0 | max:100" />
					<template v-if="model.numberOpenableParts !== '3'">
						<FormKit
							id="midHeightOpenablePart4" type="govInputWithSuffix" suffix-text="m"
							label="Mid height of the air flow path for openable part 4 "
							help="Enter the height from the ground to the midpoint of the openable section of the window"
							name="midHeightOpenablePart4"
							validation="required | number | min:0 | max:100" />
					</template>
				</template>
			</template>
		</template>
		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

		<table class="govuk-table">
			<caption class="govuk-table__caption govuk-table__caption--m govuk-!-margin-bottom-6">Window shading</caption>
		
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<td class="govuk-table__guidance_link" colspan="3">
						<a href="/guidance/window-shading-guidance" target="_blank" class="govuk-link">
							Shading guidance (opens in another window)
						</a>
					</td>
				</tr>	
				<tr class="govuk-table__row">
					<th scope="col" class="govuk-!-text-align-left">Type of shading</th>
					<th scope="col" class="govuk-!-text-align-left">Depth</th>
					<th scope="col" class="govuk-!-text-align-left">Distance</th>
				</tr>
			</thead>
			<tbody class="govuk-table__body">
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-!-text-align-left">Overhang</th>
					<td>
						<FormKit
							id="overhangDepth" type="govInputWithSuffix" suffix-text="m" name="overhangDepth"
							validation="number0" />
					</td>
					<td>
						<FormKit
							id="overhangDistance" type="govInputWithSuffix" suffix-text="m" name="overhangDistance"
							validation="number0" />
					</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-!-text-align-left">Side fin right</th>
					<td>
						<FormKit
							id="sideFinRightDepth" type="govInputWithSuffix" suffix-text="m" name="sideFinRightDepth"
							validation="number0" />
					</td>
					<td>
						<FormKit
							id="sideFinRightDistance" type="govInputWithSuffix" suffix-text="m" name="sideFinRightDistance"
							validation="number0" />
					</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-!-text-align-left">Side fin left</th>
					<td>
						<FormKit
							id="sideFinLeftDepth" type="govInputWithSuffix" suffix-text="m" name="sideFinLeftDepth"
							validation="number0" />
					</td>
					<td>
						<FormKit
							id="sideFinLeftDistance" type="govInputWithSuffix" suffix-text="m" name="sideFinLeftDistance"
							validation="number0" />
					</td>
				</tr>
			</tbody>
		</table>
		<GovAccordion>
			<GovAccordionSection id="curtainsAndBlinds" title="Curtains and blinds (optional inputs)" :index="0" heading-size="m">
				<FormKit
					id="treatmentType"
					type="govRadios"
					:options="windowTreatmentTypeOptions"
					label="Type"
					help="Determines behaviour (curtains are scheduled, blinds respond to sunlight)"
					name="treatmentType"
				/>
				<FormKit
					v-if="model.treatmentType === 'curtains'"
					id="curtainsControlObject"
					type="govRadios"
					:options="curtainsControlObjectOptions"
					label="Curtains control object reference"
					help="Reference to an OnOffTimeControl object that determines when curtains should open"
					name="curtainsControlObject"
				/>
				<FormKit
					id="thermalResistivityIncrease"
					type="govInputWithSuffix"
					suffix-text="W/(m²·K)"
					label="Thermal resistivity increase"
					help="Additional thermal resistivity applied to window when curtain/blind is closed"
					name="thermalResistivityIncrease"
					validation="number | min:0 | max:100"
				/>
				<FormKit
					id="solarTransmittanceReduction"
					type="govInputFloat"
					label="Solar transmittance reduction"
					help="Proportion of solar energy allowed through the window which is allowed into the zone when curtain/blind is closed (ie this is an additional reduction in transmission after the initial reduction by the window). Decimal 0-1"
					name="solarTransmittanceReduction"
					validation="number | min:0 | max:1"
				/>
			</GovAccordionSection>
		</GovAccordion>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
<style scoped lang="scss">
	.govuk-table__guidance_link {
		padding-bottom: 40px;
	}
</style>