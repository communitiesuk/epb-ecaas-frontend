<script setup lang="ts">
import { getUrl, standardPitchOptions, uniqueName, type ExternalGlazedDoorData } from "#imports";
import { gValueZod, heightTransparentZod, maxWindowOpenAreaZod, midHeightAirFlowPathZod, widthTransparentZod } from "~/stores/ecaasStore.schema";
import { zodTypeAsFormKitValidation } from "~/utils/zodToFormKitValidation";
import { isFlatRoofItem } from "~/utils/isFlatRoofItem";

const title = "External glazed door";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const externalGlazedDoorData = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data;
const index = getStoreIndex(externalGlazedDoorData);
const doorData = useItemToEdit("door", externalGlazedDoorData);
const model = ref(doorData?.data);
const { dwellingSpaceExternalWall } = store.dwellingFabric.dwellingSpaceWalls;
const { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

const shading = model?.value && "shading" in model.value ? model.value.shading : [];

const saveForm = (fields: ExternalGlazedDoorData) => {
	store.$patch((state) => {
		const { dwellingSpaceExternalGlazedDoor } = state.dwellingFabric.dwellingSpaceDoors;

		const commonFields = { 
			name: fields.name,
			associatedItemId: fields.associatedItemId,
			isTheFrontDoor: fields.isTheFrontDoor,
			pitch: fields.pitch,
			orientation: fields.orientation,
			height: fields.height,
			width: fields.width,
			securityRisk: fields.securityRisk,
			solarTransmittance: fields.solarTransmittance,
			elevationalHeight: fields.elevationalHeight,
			openingToFrameRatio: fields.openingToFrameRatio,
			maximumOpenableArea: fields.maximumOpenableArea,
			heightOpenableArea: fields.height,
			uValue: fields.uValue,
			...(fields.curtainsOrBlinds ? {
				curtainsOrBlinds: true,
				treatmentType: fields.treatmentType,
				treatmentControls: fields.treatmentControls,
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

		const existingShading = (dwellingSpaceExternalGlazedDoor.data[index]?.data as Record<string, unknown>)?.shading;

		dwellingSpaceExternalGlazedDoor.data[index] = {
			data: {
				...commonFields,
				...openablePartsFields,
				...(fields.hasShading ? {
					hasShading: true,
					shading: existingShading ?? [],
				} : {
					hasShading: false, 
				}),
			} as ExternalGlazedDoorData,
			complete: true,
		};
		dwellingSpaceExternalGlazedDoor.complete = false;
	});
	navigateTo("/dwelling-fabric/doors");
};

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
		const existingShading = (state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data[index]?.data as Record<string, unknown> | undefined)?.shading;
		state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data[index] = newData;
		if (existingShading !== undefined) {
			(state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data[index].data as Record<string, unknown>).shading = existingShading;
		}
		state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.complete = false;
	},
});

function canBeFrontDoor(node: FormKitNode) {
	if (node.value === true) {
		const glazedDoorsExcludingCurrent = externalGlazedDoorData.toSpliced(index, 1);
		const { dwellingSpaceExternalUnglazedDoor, dwellingSpaceInternalDoor } = store.dwellingFabric.dwellingSpaceDoors;
		const doors = [...glazedDoorsExcludingCurrent, dwellingSpaceExternalUnglazedDoor.data, dwellingSpaceInternalDoor.data].flat();
		for (const door of doors) {
			return !door.data.isTheFrontDoor;			
		}
	} return true;
}
const { handleInvalidSubmit, errorMessages } = useErrorSummary();

const writeShadingToStore = (items: ShadingObjectData[]) => {
	store.$patch((state) => {
		const door = state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data[index];
		if (!door) return;
		(door.data as Record<string, unknown>).shading = items;
	});
};

const tagHasValidPitch = computed(() => {
	const taggedItem = store.getTaggedItem(
		[dwellingSpaceExternalWall, dwellingSpaceRoofs],
		model.value?.associatedItemId,
	);

	return taggedItem?.pitch !== 0 && taggedItem?.pitch !== 180;
});


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
		<NotificationsDoorBanner/>
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
			help="Enter the height of the door, including the frame"
			name="height"
			:validation="zodTypeAsFormKitValidation(heightTransparentZod)"
			data-field="Zone.BuildingElement.*.height"
		/>
		<FormKit
			id="width"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Width"
			help="Enter the width of the door, including the frame"
			name="width"
			:validation="zodTypeAsFormKitValidation(widthTransparentZod)"
			data-field="Zone.BuildingElement.*.width"
		/>
		<FieldsElevationalHeight />
		<FieldsUValue/>
		<FormKit
			id="openingToFrameRatio"
			type="govInputFloat"
			label="Frame to opening ratio"
			help="Enter the proportion of the window taken up by the frame compared to the total opening area. It should be a decimal between 0 and 1."
			name="openingToFrameRatio"
			validation="required | number | min:0 | max:1"
			data-field="Zone.BuildingElement.*.frame_area_fraction"
		>
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">Frame to opening ratio</th>
							<th scope="col" class="govuk-table__header">Description</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">0</th>
							<td class="govuk-table__cell">There is no frame, only glass</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">1</th>
							<td class="govuk-table__cell">There is no glass</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="solarTransmittance"
			type="govInputFloat"
			label="Transmittance of solar energy "
			help="Enter the total solar energy transmittance or G value of the transparent part of the window. It should be a decimal between 0 and 1."
			name="solarTransmittance"
			:validation="zodTypeAsFormKitValidation(gValueZod)"
			data-field="Zone.BuildingElement.*.g_value"
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
			help="A door is a security risk if you are unable to leave it open at night. If it is on the ground floor, in a basement, or is easily accessible, it is a security risk."
			validation="required"
			data-field="Zone.BuildingElement.*.security_risk"
		/>
		<FormKit
			id="maximumOpenableArea"
			type="govInputWithSuffix"
			suffix-text="m²"
			label="Maximum openable area of door"
			help="Enter the total area of the gap created when the door is fully open, as defined by Part O"
			name="maximumOpenableArea"
			:validation="zodTypeAsFormKitValidation(maxWindowOpenAreaZod)"
			data-field="Zone.BuildingElement.*.max_window_open_area"
		/>
		<template v-if="!!model && model.numberOpenableParts && model.numberOpenableParts !== '0'">
			<FormKit
				id="midHeightOpenablePart1"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Mid height of the air flow path for openable part 1 "
				help="Enter the height from the lowest finished floor of the dwelling to the midpoint of the air flow path through this part of the door when fully open"
				name="midHeightOpenablePart1"
				:validation="zodTypeAsFormKitValidation(midHeightAirFlowPathZod)"
			/>
			<template v-if="model.numberOpenableParts !== '1'">
				<FormKit
					id="midHeightOpenablePart2"
					type="govInputWithSuffix"
					suffix-text="m"
					label="Mid height of the air flow path for openable part 2 "
					help="Enter the height from the lowest finished floor of the dwelling to the midpoint of the air flow path through this part of the door when fully open"
					name="midHeightOpenablePart2"
					:validation="zodTypeAsFormKitValidation(midHeightAirFlowPathZod)"
				/>
				<template v-if="model.numberOpenableParts !== '2'">
					<FormKit
						id="midHeightOpenablePart3"
						type="govInputWithSuffix"
						suffix-text="m"
						label="Mid height of the air flow path for openable part 3 "
						help="Enter the height from the lowest finished floor of the dwelling to the midpoint of the air flow path through this part of the door when fully open"
						name="midHeightOpenablePart3"
						:validation="zodTypeAsFormKitValidation(midHeightAirFlowPathZod)"
					/>
					<template v-if="model.numberOpenableParts !== '3'">
						<FormKit
							id="midHeightOpenablePart4"
							type="govInputWithSuffix"
							suffix-text="m"
							label="Mid height of the air flow path for openable part 4 "
							help="Enter the height from the lowest finished floor of the dwelling to the midpoint of the air flow path through this part of the door when fully open"
							name="midHeightOpenablePart4"
							:validation="zodTypeAsFormKitValidation(midHeightAirFlowPathZod)"
						/>
					</template>
				</template>
			</template>
		</template>
		<FormKit
			v-if="tagHasValidPitch &&
				(!isFlatRoofItem(model?.associatedItemId!) ||
					!model?.associatedItemId ||
					model.associatedItemId === 'none') && (model?.pitch !== 0 && model?.pitch !== 180)"
			id="isTheFrontDoor"
			type="govBoolean"
			label="Is this the front door?"
			name="isTheFrontDoor"
			:validation-rules="{ canBeFrontDoor }"
			validation="required | canBeFrontDoor" 
			:validation-messages="{
				canBeFrontDoor: 'Another door has already been marked as the front door. Please change that entry if you wish to mark this door as the front door instead.'
			}"
		/>
		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
		<h2 class="govuk-heading-l">Window shading</h2>
		<FormKit
			id="hasShading"
			type="govBoolean"
			label="Does anything shade the window?"
			name="hasShading"
			validation="required"
		/>
		<ShadingSection
			v-if="model?.hasShading"
			:index="index"
			:model="shading"
			shading-section-type="window"
			:write-shading-to-store="writeShadingToStore"
		/>
		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

		<h2 class="govuk-heading-l">Curtains and blinds</h2>
		<FormKit
			id="curtainsOrBlinds"
			type="govBoolean"
			label="Does this window have any curtains or blinds?"
			name="curtainsOrBlinds"
			validation="required"
		/>
		<WindowTreatmentSection
			v-if="model && model.curtainsOrBlinds"
			treatment-section-type="door"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceDoors')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>