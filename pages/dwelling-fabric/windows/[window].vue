<script setup lang="ts">
import { standardPitchOptions, type WindowData } from "#imports";
import { millimetre } from "~/utils/units/length";
import type { SchemaWindowTreatmentControl, SchemaWindowTreatmentType } from "~/schema/aliases";
import { unitValue } from "~/utils/units";
import { getUrl } from "#imports";

const title = "Window";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const window = useItemToEdit("window", store.dwellingFabric.dwellingSpaceWindows.data);

// prepopulate shading data when using old input format
if (window && "overhangDepth" in window && typeof window.overhangDepth === "number") {
	window.overhangDepth = unitValue(window.overhangDepth, millimetre);
};

if (window && "overhangDistance" in window) {
	window.overhangDistance = typeof window.overhangDistance === "number" ? unitValue(window.overhangDistance, millimetre) : window.overhangDistance;
};

if (window && "sideFinRightDepth" in window) {
	window.sideFinRightDepth = typeof window.sideFinRightDepth === "number" ? unitValue(window.sideFinRightDepth, millimetre) : window.sideFinRightDepth;
};

if (window && "sideFinRightDistance" in window) {
	window.sideFinRightDistance = typeof window.sideFinRightDistance === "number" ? unitValue(window.sideFinRightDistance, millimetre) : window.sideFinRightDistance;
};

if (window && "sideFinLeftDepth" in window) {
	window.sideFinLeftDepth = typeof window.sideFinLeftDepth === "number" ? unitValue(window.sideFinLeftDepth, millimetre) : window.sideFinLeftDepth;
};

if (window && "sideFinLeftDistance" in window) {
	window.sideFinLeftDistance = typeof window.sideFinLeftDistance === "number" ? unitValue(window.sideFinLeftDistance, millimetre) : window.sideFinLeftDistance;
};

const model = ref(window?.data);

const windowTreatmentTypeOptions: Record<SchemaWindowTreatmentType, SnakeToSentenceCase<SchemaWindowTreatmentType>> = {
	curtains: "Curtains",
	blinds: "Blinds",
};
const curtainsControlObjectOptions: Record<Exclude<SchemaWindowTreatmentControl, "manual_motorised" | "combined_light_blind_HVAC">, string> = {
	auto_motorised: "Auto motorised",
	manual: "Manual",
};

const shadingValidation = (siblingField: string) => {
	const siblingValue = (model.value as Record<string, unknown>)[siblingField];
	return siblingValue != null && siblingValue !== "" ? "required" : "";
};

const saveForm = (fields: WindowData) => {
	store.$patch((state) => {

		const { dwellingSpaceWindows } = state.dwellingFabric;
		const index = getStoreIndex(dwellingSpaceWindows.data);

		const commonFields = {
			name: fields.name,
			orientation: fields.orientation,
			height: fields.height,
			width: fields.width,
			uValue: fields.uValue,
			pitchOption: fields.pitchOption,
			pitch: fields.pitchOption === "90" ? 90 : fields.pitch,
			solarTransmittance: fields.solarTransmittance,
			elevationalHeight: fields.elevationalHeight,
			midHeight: fields.midHeight,
			openingToFrameRatio: fields.openingToFrameRatio,
			...("overhangDepth" in fields && "overhangDistance" in fields
				? {
					overhangDepth: fields.overhangDepth,
					overhangDistance: fields.overhangDistance,
				} : {}
			),
			...("sideFinRightDepth" in fields && "sideFinRightDistance" in fields
				? {
					sideFinRightDepth: fields.sideFinRightDepth,
					sideFinRightDistance: fields.sideFinRightDistance,
				} : {}
			),
			...("sideFinLeftDepth" in fields && "sideFinLeftDistance" in fields ? {
				sideFinLeftDepth: fields.sideFinLeftDepth,
				sideFinLeftDistance: fields.sideFinLeftDistance,
			} : {}
			),
		};

		let commonFieldsIncludingOpenableParts;

		const numberParts = fields.numberOpenableParts;

		switch (numberParts) {
			case "0":
				commonFieldsIncludingOpenableParts = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
				};
				break;
			case "1":
				commonFieldsIncludingOpenableParts = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					maximumOpenableArea: fields.maximumOpenableArea,
					heightOpenableArea: fields.heightOpenableArea,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
				};
				break;
			case "2":
				commonFieldsIncludingOpenableParts = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					maximumOpenableArea: fields.maximumOpenableArea,
					heightOpenableArea: fields.heightOpenableArea,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
					midHeightOpenablePart2: fields.midHeightOpenablePart2,
				};
				break;
			case "3":
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
			case "4":
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
		let newWindowValue : WindowData;

		if (fields.curtainsOrBlinds) {

			newWindowValue = {
				...commonFieldsIncludingOpenableParts,
				curtainsOrBlinds: true,
				treatmentType: fields.treatmentType,
				thermalResistivityIncrease: fields.thermalResistivityIncrease,
				solarTransmittanceReduction: fields.solarTransmittanceReduction,
				...(fields.treatmentType === "curtains" ? { curtainsControlObject: fields.curtainsControlObject } : {}),
			} as WindowData;
		
		} else {
			
			newWindowValue = {
				curtainsOrBlinds: false,
				...commonFieldsIncludingOpenableParts,
			} as WindowData;
		}

		dwellingSpaceWindows.data[index] = {
			data: newWindowValue,
			complete: true,
		};

		dwellingSpaceWindows.complete = false;
	});
	navigateTo("/dwelling-fabric/windows");
};

autoSaveElementForm<WindowData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceWindows,
	defaultName: "Window",
	onPatch: (state, newData, index) => {
		const { pitchOption, pitch } = newData.data;
		newData.data.pitch = pitchOption === "90" ? 90 : pitch;
		state.dwellingFabric.dwellingSpaceWindows.data[index] = newData;
		state.dwellingFabric.dwellingSpaceWindows.complete = false;
	},
});

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
			:pitch-option="model && model.pitchOption"
			:options="standardPitchOptions()"
			data-field="Zone.BuildingElement.*.pitch"
		/>
		<FieldsOrientation data-field="Zone.BuildingElement.*.orientation" />
		<FormKit
			id="height" type="govInputWithSuffix" suffix-text="m" label="Height"
			help="Enter the height of the building element" name="height" validation="required | number | min:0.001 | max:50"
			data-field="Zone.BuildingElement.*.height" />
		<FormKit
			id="width" type="govInputWithSuffix" suffix-text="m" label="Width" help="Enter the width of the building element"
			name="width" validation="required | number | min:0.001 | max:50"
			data-field="Zone.BuildingElement.*.width" />
		<FieldsElevationalHeight />
		<FieldsUValue id="uValue" name="uValue" />
		<FormKit
			id="solarTransmittance" type="govInputFloat" label="Transmittance of solar energy "
			help="Enter the total solar energy transmittance, or G value, of the transparent part of the window. It should be a decimal between 0 and 1."
			name="solarTransmittance" validation="required | number | min:0.01 | max:1"
			data-field="Zone.BuildingElement.*.g_value" />
		<FormKit
			id="midHeight" type="govInputWithSuffix" suffix-text="m" label="Mid height"
			help="Enter the height from the ground to the midpoint of the window" name="midHeight"
			validation="required | number | min:0 | max:100"
			data-field="Zone.BuildingElement.*.mid_height" />
		<FormKit
			id="openingToFrameRatio" type="govInputFloat" label="Opening to frame ratio"
			help="Enter the proportion of the window taken up by the total opening area compared to the frame"
			name="openingToFrameRatio" validation="required | number | min:0 | max:1"
			data-field="Zone.BuildingElement.*.frame_area_fraction">
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header govuk-!-width-one-half">Opening to frame ratio</th>
							<th scope="col" class="govuk-table__header">Description</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">0</th>
							<td class="govuk-table__cell">There is no opening.</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">1</th>
							<td class="govuk-table__cell">There is no frame, only glass.</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="numberOpenableParts" type="govRadios" :options="{
				1: '1',
				2: '2',
				3: '3',
				4: '4',
				0: 'None',
			}" label="Number of openable parts " name="numberOpenableParts" validation="required" />
		<template v-if="!!model && model.numberOpenableParts && model.numberOpenableParts !== '0'">
			<FormKit
				id="heightOpenableArea" type="govInputWithSuffix" suffix-text="m" label="Height of the openable area"
				help="Enter the vertical measurement of the section of the window that can be opened"
				name="heightOpenableArea" validation="required | number | min:0 | max:100" />
			<FormKit
				id="maximumOpenableArea" type="govInputWithSuffix" suffix-text="m²" label="Maximum openable area"
				help="Enter the total area of the gap created when the window is fully open" name="maximumOpenableArea"
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
							Guidance on window shading (opens in another window)
						</a>
					</td>
				</tr>	
				<tr class="govuk-table__row shading-header-row">
					<th scope="col" class="govuk-!-text-align-left govuk-!-width-one-quarter">Type of shading</th>
					<th scope="col" class="govuk-!-text-align-left govuk-!-width-one-third">Depth</th>
					<th scope="col" class="govuk-!-text-align-left govuk-!-width-one-third">Distance from glass</th>
				</tr>
			</thead>
			<tbody class="govuk-table__body shading-table-body">
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-!-text-align-left">Overhang</th>
					<td>
						<FormKit
							id="overhangDepth"
							name="overhangDepth"
							type="govInputWithUnit"
							:unit="millimetre"
							:validation="shadingValidation('overhangDistance')"
							validation-label="Overhang depth "
						/>
					</td>
					<td>
						<FormKit
							id="overhangDistance"
							name="overhangDistance"
							type="govInputWithUnit"
							:unit="millimetre"
							:validation="shadingValidation('overhangDepth')"
							validation-label="Overhang distance "
						/>
					</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-!-text-align-left">Side fin right</th>
					<td>
						<FormKit
							id="sideFinRightDepth"
							name="sideFinRightDepth"
							type="govInputWithUnit"
							:unit="millimetre"
							:validation="shadingValidation('sideFinRightDistance')"
							validation-label="Side fin right depth "
						/>
					</td>
					<td>
						<FormKit
							id="sideFinRightDistance"
							name="sideFinRightDistance"
							type="govInputWithUnit"
							:unit="millimetre"
							:validation="shadingValidation('sideFinRightDepth')"
							validation-label="Side fin right distance "
						/>
					</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-!-text-align-left">Side fin left</th>
					<td>
						<FormKit
							id="sideFinLeftDepth"
							name="sideFinLeftDepth"
							type="govInputWithUnit"
							:unit="millimetre"
							:validation="shadingValidation('sideFinLeftDistance')"
							validation-label="Side fin left depth "
						/>
					</td>
					<td>
						<FormKit
							id="sideFinLeftDistance"
							name="sideFinLeftDistance"
							type="govInputWithUnit"
							:unit="millimetre"
							:validation="shadingValidation('sideFinLeftDepth')"
							validation-label="Side fin left distance "
						/>
					</td>
				</tr>
			</tbody>
		</table>

		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

		<h2 class="govuk-heading-l">Curtains and blinds</h2>
		<FormKit
			id="curtainsOrBlinds"
			type="govBoolean"
			label="Does this window have any curtains or blinds?"
			name="curtainsOrBlinds"
			validation="required"
		/>
		<template v-if="model && model.curtainsOrBlinds">
			<FormKit
				id="treatmentType"
				type="govRadios"
				:options="windowTreatmentTypeOptions"
				label="Type"
				help="This determines the behaviour. Curtains are scheduled and blinds respond to sunlight."
				name="treatmentType"
				validation="required"
			/>
			<FormKit
				v-if="model && 'treatmentType' in model && model.treatmentType === 'curtains'"
				id="curtainsControlObject"
				type="govRadios"
				:options="curtainsControlObjectOptions"
				label="Curtains control object reference"
				help="Reference to an OnOffTimeControl object that determines when curtains should open"
				name="curtainsControlObject"
				validation="required"
			/>
			<FormKit
				id="thermalResistivityIncrease"
				type="govInputWithSuffix"
				suffix-text="W/(m²·K)"
				label="Thermal resistivity increase"
				help="Enter the additional thermal resistivity applied to window when the curtain or blind is closed"
				name="thermalResistivityIncrease"
				validation="required | number | min:0 | max:100"
			/>
			<FormKit
				id="solarTransmittanceReduction"
				type="govInputFloat"
				label="Solar transmittance reduction"
				help="Enter the proportion of solar energy allowed through the window which is allowed into the zone when curtain or blind is closed. This should be a decimal between 0 and 1."
				name="solarTransmittanceReduction"
				validation="required | number | min:0 | max:1"
			/>
		</template>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceWindows')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
<style scoped lang="scss">
	.govuk-table__guidance_link {
		padding-bottom: 40px;
	}
	.shading-table-body {
		td {
			vertical-align: bottom;
		}
		th {
			vertical-align: bottom;
			padding-bottom: 32px;
		}
	}
	.shading-header-row th {
		padding-bottom: 20px;
	}
</style>