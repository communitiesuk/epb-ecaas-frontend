<script setup lang="ts">
import { getUrl, standardPitchOptions, uniqueName, type ExternalGlazedDoorData } from "#imports";
import type { SchemaWindowTreatmentType } from "~/schema/aliases";

const title = "External glazed door";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const externalGlazedDoorData = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor?.data;
const index = getStoreIndex(externalGlazedDoorData);
const doorData = useItemToEdit("door", externalGlazedDoorData);
const model = ref(doorData?.data);

const saveForm = (fields: ExternalGlazedDoorData) => {
	store.$patch((state) => {
		const { dwellingSpaceExternalGlazedDoor } = state.dwellingFabric.dwellingSpaceDoors;

		const shouldSavePitchOrientation = tagOptions.length === 0 || fields.associatedItemId === "none";

		const commonFields = { 
			name: fields.name,
			associatedItemId: shouldSavePitchOrientation ? undefined : fields.associatedItemId,
			isTheFrontDoor: fields.isTheFrontDoor,
			pitch: shouldSavePitchOrientation ? fields.pitch : undefined,
			orientation: shouldSavePitchOrientation ? fields.orientation : undefined,
			height: fields.height,
			width: fields.width,
			securityRisk: fields.securityRisk,
			solarTransmittance: fields.solarTransmittance,
			elevationalHeight: fields.elevationalHeight,
			midHeight: fields.midHeight,
			openingToFrameRatio: fields.openingToFrameRatio,
			maximumOpenableArea: fields.maximumOpenableArea,
			heightOpenableArea: fields.height,
			thermalResistance: fields.thermalResistance, 
			...(fields.curtainsOrBlinds ? {
				curtainsOrBlinds: true,
				treatmentType: fields.treatmentType,
				thermalResistivityIncrease: fields.thermalResistivityIncrease,
				solarTransmittanceReduction: fields.solarTransmittanceReduction,
			} : {
				curtainsOrBlinds: false,
			}),

		};

		const numberParts = fields.numberOpenableParts;

		let openablePartsFields;

		switch (numberParts) {
			case "0":
				openablePartsFields = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
				} as Extract<ExternalGlazedDoorData, { numberOpenableParts: "0" }>;
				break;
			case "1":
				openablePartsFields = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
				} as Extract<ExternalGlazedDoorData, { numberOpenableParts: "1" }>;
				break;
			case "2":
				openablePartsFields = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
					midHeightOpenablePart2: fields.midHeightOpenablePart2,
				} as Extract<ExternalGlazedDoorData, { numberOpenableParts: "2" }>;
				break;
			case "3":
				openablePartsFields = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
					midHeightOpenablePart2: fields.midHeightOpenablePart2,
					midHeightOpenablePart3: fields.midHeightOpenablePart3,
				} as Extract<ExternalGlazedDoorData, { numberOpenableParts: "3" }>;
				break;
			case "4":
				openablePartsFields = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
					midHeightOpenablePart2: fields.midHeightOpenablePart2,
					midHeightOpenablePart3: fields.midHeightOpenablePart3,
					midHeightOpenablePart4: fields.midHeightOpenablePart4,
				} as Extract<ExternalGlazedDoorData, { numberOpenableParts: "4" }>;
				break;
			default:
				openablePartsFields = {
					...commonFields,
					numberOpenableParts: "0",
				} as Extract<ExternalGlazedDoorData, { numberOpenableParts: "0" }>;
				break;
		}



		dwellingSpaceExternalGlazedDoor.data[index] = {
			data: {
				...commonFields,
				...openablePartsFields,
			},
			complete: true,
		};
		dwellingSpaceExternalGlazedDoor.complete = false;
	});
	navigateTo("/dwelling-fabric/doors");
};

const { dwellingSpaceExternalWall } = store.dwellingFabric.dwellingSpaceWalls;
const { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

const tagOptions = [
	...dwellingSpaceExternalWall.data.map(x => [x.data.id, x.data.name] as [string, string]),
	...dwellingSpaceRoofs.data.map(x => [x.data.id, x.data.name] as [string, string]),
].filter(x => x[0] !== undefined);

if (model.value && model.value.associatedItemId === undefined) {
	model.value.associatedItemId = "none";
}

autoSaveElementForm<ExternalGlazedDoorData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor,
	defaultName: "External glazed door",
	onPatch: (state, newData, index) => {
		state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data[index] = newData;
		state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.complete = false;
	},
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();

const windowTreatmentTypeOptions: Record<SchemaWindowTreatmentType, SnakeToSentenceCase<SchemaWindowTreatmentType>> = {
	curtains: "Curtains",
	blinds: "Blinds",
};
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="externalGlazedDoorErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(externalGlazedDoorData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FormKit
			id="isTheFrontDoor"
			type="govBoolean"
			label="Is this the front door?"
			name="isTheFrontDoor"
			validation="required" />

		<FieldsAssociatedWallRoof
			id="associatedItemId"
			name="associatedItemId"
			label="Associated wall or roof"
			help="Select the wall or roof that this door is in. It should have the same orientation and pitch as the door."
		/>
		<template v-if="model && (model.associatedItemId === 'none' || tagOptions.length === 0)">
			<FieldsPitch
				:pitch-option="model?.pitchOption"
				:options='standardPitchOptions()'
				data-field="Zone.BuildingElement.*.pitch"
				:suppress-standard-guidance="true"
			/>
			<FieldsOrientation
				v-if="model.pitchOption === '90' || (model.pitch != null && model.pitch !== 0 && model.pitch !== 180)"
				id="orientation"
				name="orientation"
				data-field="Zone.BuildingElement.*.orientation360"
			/>
		</template>
		<FormKit
			id="height"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Height"
			help="Enter the height of the building element"
			name="height"
			validation="required | number | min:0.001 | max:50"
			data-field="Zone.BuildingElement.*.height"
		/>
		<FormKit
			id="width"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Width"
			help="Enter the width of the building element"
			name="width"
			validation="required | number | min:0.001 | max:50"
			data-field="Zone.BuildingElement.*.width"
		/>
		<FieldsElevationalHeight />
		<FormKit
			id="thermalResistance"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance"
			help="Enter the thermal resistance of all layers in the door construction"
			name="thermalResistance"
			validation="required | number | min:0.00001 | max:50"
		><GovDetails summary-text="Help with this input">
			<p>Thermal resistance is a property indicating a materials' opposition to heat flow. It is calculated as the thickness of the material divided by its thermal conductivity. Higher thermal resistance reduces heat transfer.
			</p>
		</GovDetails>
		</FormKit>
		<FormKit
			id="openingToFrameRatio"
			type="govInputFloat"
			label="Window to frame ratio"
			help="Enter the proportion of the door taken up by the window"
			name="openingToFrameRatio"
			validation="required | number | min:0 | max:1"
			data-field="Zone.BuildingElement.*.frame_area_fraction"
		>
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header govuk-!-width-one-third">Window to door ratio</th>
							<th scope="col" class="govuk-table__header">Description</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">0</th>
							<td class="govuk-table__cell">There is no window in the door.</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">1</th>
							<td class="govuk-table__cell">There is no frame, only glass.</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="solarTransmittance"
			type="govInputFloat"
			label="Transmittance of solar energy "
			help="Enter the total solar energy transmittance or G value, or the transparent part of the window. It should be a decimal between 0 and 1."
			name="solarTransmittance"
			validation="required | number | min:0.01 | max:1"
			data-field="Zone.BuildingElement.*.g_value"
		/>
		<FormKit
			id="midHeight"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Mid height"
			help="Enter the height from the ground to the midpoint of the window"
			name="midHeight"
			validation="required | number | min:0 | max:100"
			data-field="Zone.BuildingElement.*.mid_height"
		/>
		<FormKit
			id="numberOpenableParts"
			type="govRadios"
			:options="{
				1: '1',
				2: '2',
				3: '3',
				4: '4',
				0: 'None',
			}"
			label="Number of additional openable parts"
			name="numberOpenableParts"
			validation="required"
		/>
		<FormKit
			id="securityRisk"
			name="securityRisk"
			type="govBoolean"
			label="Is having this door open a security risk?"
			help="For example, if you are able to leave the door open at night it would not be a security risk"
			validation="required"
			data-field="Zone.BuildingElement.*.security_risk"
		/>
		<FormKit
			id="maximumOpenableArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Maximum openable area of door"
			help="Enter the total area of the gap created when the door is fully open"
			name="maximumOpenableArea"
			validation="required | number | min:0.01 | max:10000"
			data-field="Zone.BuildingElement.*.max_window_open_area"
		/>
		<template v-if="!!model && model.numberOpenableParts && model.numberOpenableParts !== '0'">
			<FormKit
				id="midHeightOpenablePart1"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Mid height of the air flow path for openable part 1 "
				help="Enter the height from the ground to the midpoint of the openable section of the window"
				name="midHeightOpenablePart1"
				validation="required | number | min:0 | max:100"
			/>
			<template v-if="model.numberOpenableParts !== '1'">
				<FormKit
					id="midHeightOpenablePart2"
					type="govInputWithSuffix"
					suffix-text="m"
					label="Mid height of the air flow path for openable part 2 "
					help="Enter the height from the ground to the midpoint of the openable section of the window"
					name="midHeightOpenablePart2"
					validation="required | number | min:0 | max:100"
				/>
				<template v-if="model.numberOpenableParts !== '2'">
					<FormKit
						id="midHeightOpenablePart3"
						type="govInputWithSuffix"
						suffix-text="m"
						label="Mid height of the air flow path for openable part 3 "
						help="Enter the height from the ground to the midpoint of the openable section of the window"
						name="midHeightOpenablePart3"
						validation="required | number | min:0 | max:100"
					/>
					<template v-if="model.numberOpenableParts !== '3'">
						<FormKit
							id="midHeightOpenablePart4"
							type="govInputWithSuffix"
							suffix-text="m"
							label="Mid height of the air flow path for openable part 4 "
							help="Enter the height from the ground to the midpoint of the openable section of the window"
							name="midHeightOpenablePart4"
							validation="required | number | min:0 | max:100"
						/>
					</template>
				</template>
			</template>
		</template>
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
			<GovButton :href="getUrl('dwellingSpaceDoors')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>