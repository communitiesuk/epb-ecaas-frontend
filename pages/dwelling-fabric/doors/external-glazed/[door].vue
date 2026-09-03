<script setup lang="ts">
import { getUrl, standardPitchOptions, uniqueName, type ExternalGlazedDoorData } from "#imports";
import { v4 as uuidv4 } from "uuid";
import { freeAreaHeightZod, gValueZod, heightTransparentZod, maxWindowOpenAreaZod, midHeightAirFlowPathZod, revealDimensionZod, widthTransparentZod } from "~/stores/ecaasStore.schema";
import { isFlatRoofItem } from "~/utils/isFlatRoofItem";
import { zodTypeAsFormKitValidation } from "~/utils/zodToFormKitValidation";

const title = "External glazed door";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();
const { mounted } = useMounted();


const externalGlazedDoorData = store.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data;
const index = getStoreIndex(externalGlazedDoorData);
const doorData = useItemToEdit("door", externalGlazedDoorData);
const model = ref(doorData?.data);
const { dwellingSpaceExternalWall } = store.dwellingFabric.dwellingSpaceWalls;
const { dwellingSpaceRoofs } = store.dwellingFabric;

const shading = model?.value && "shading" in model.value ? model.value.shading : [];

function assignIdToLegacyData(doorData: { id?: string } | undefined) {
	if (!doorData) return;
	doorData.id ??= uuidv4();
}

onMounted(() => {
	assignIdToLegacyData(doorData?.data);
});

const saveForm = (fields: ExternalGlazedDoorData) => {
	store.$patch((state) => {
		const { dwellingSpaceExternalGlazedDoor } = state.dwellingFabric.dwellingSpaceDoors;

		const commonFields = { 
			id: doorData?.data.id ?? uuidv4(),
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
			uValue: fields.uValue,
			depthOfReveal: fields.depthOfReveal,
			distanceFromGlassToStartOfReveal: fields.distanceFromGlassToStartOfReveal,
			numberOpenableParts: fields.numberOpenableParts,
			openableParts: fields.openableParts,
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

		const existingShading = (dwellingSpaceExternalGlazedDoor.data[index]?.data as Record<string, unknown>)?.shading;

		dwellingSpaceExternalGlazedDoor.data[index] = {
			data: {
				...commonFields,
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
		newData.data.id ??= uuidv4();
		const existingShading = (state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data[index]?.data as Record<string, unknown> | undefined)?.shading;
		state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data[index] = newData;
		if (existingShading !== undefined) {
			(state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.data[index].data as Record<string, unknown>).shading = existingShading;
		}
		state.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor.complete = false;
	},
});

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

const createOpenableParts = (numberOpenableParts: string | undefined) => {
	return Array.from({ length: numberOpenableParts ? parseInt(numberOpenableParts) : 0 }, () => ({}));
};

const openableParts = ref(createOpenableParts(model.value?.numberOpenableParts));

watch(model, (currentModel, prevModel) => {
	if (currentModel && currentModel?.numberOpenableParts !== prevModel?.numberOpenableParts) {
		openableParts.value = createOpenableParts(currentModel.numberOpenableParts);
	}
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
			v-if="mounted"
			id="associatedItemId"
			name="associatedItemId"
			label="Associated wall or roof"
			help="Select the wall or roof that this door is in. It should have the same orientation and pitch as the door."
		/>
		<template v-if="mounted && model && (model.associatedItemId === 'none' || tagOptions.length === 0)">
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
		<template v-if="model && model.numberOpenableParts">
			<ClientOnly>
				<FormKit
					v-slot="{ items }"
					v-model="openableParts"
					name="openableParts"
					type="list"
					dynamic>
					<FormKit
						v-for="(item, i) in items"
						:key="item"
						:index="i"
						type="group">
						<FormKit
							:id="`maximumOpenableArea_${i}`"
							type="govInputWithSuffix"
							suffix-text="m²"
							:label="`Maximum openable area for openable part ${i + 1}`"
							help="Enter the total area of the gap created when the window is fully open, as defined by Part O"
							name="maximumOpenableArea"
							:validation="zodTypeAsFormKitValidation(maxWindowOpenAreaZod)"
						/>
						<FormKit
							:id="`freeAreaHeight_${i}`"
							type="govInputWithSuffix"
							suffix-text="m"
							:label="`Free area height of window opening for openable part ${i + 1}`"
							help="Enter the vertical height of the section of the window that opens"
							name="freeAreaHeight"
							:validation="zodTypeAsFormKitValidation(freeAreaHeightZod)"
						>
							<GovDetails summary-text="Help with this input">
								<p class="govuk-body">This diagrams shows how to measure the free area height of a window.</p>
								<img src="/img/free_area_height.png" alt="How to measure the free area height of a window">
							</GovDetails>
						</FormKit>
						<FormKit
							:id="`midHeightOpenable_${i}`"
							type="govInputWithSuffix"
							suffix-text="m"
							:label="`Mid height of the air flow path for openable part ${i + 1}`"
							help="Enter the height from the lowest finished floor of the dwelling to the midpoint of the air flow path through this part of the window when fully open"
							name="midHeight"
							:validation="zodTypeAsFormKitValidation(midHeightAirFlowPathZod)"
						/>
					</FormKit>
				</FormKit>
			</ClientOnly>
		</template>
		<FieldsFrontDoor
			v-if="mounted && tagHasValidPitch &&
				(!isFlatRoofItem(model?.associatedItemId!) ||
					!model?.associatedItemId ||
					model.associatedItemId === 'none') && (model?.pitch !== 0 && model?.pitch !== 180)"
			:index="index"
			door-type="ExternalGlazed"
		/>
		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
		<h2 class="govuk-heading-l">Window shading</h2>
		<FormKit
			id="depthOfReveal"
			type="govInputWithSuffix"
			label="Depth of reveal"
			name="depthOfReveal"
			suffix-text="mm"
			:validation="zodTypeAsFormKitValidation(revealDimensionZod)"
		/>
		<FormKit
			id="distanceFromGlassToStartOfReveal"
			type="govInputWithSuffix"
			label="Distance from glass to start of reveal"
			help="This is usually the thickness of the frame"
			name="distanceFromGlassToStartOfReveal"
			suffix-text="mm"
			:validation="zodTypeAsFormKitValidation(revealDimensionZod)"
		/>
		<FormKit
			id="hasShading"
			type="govBoolean"
			label="Does anything else shade the window?"
			help="This could be an overhang, side fin or obstacle. Do not include anything already entered in distant shading."
			name="hasShading"
			validation="required"
		/>
		<ShadingSection
			v-if="mounted && model?.hasShading"
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
			v-if="mounted && model && model.curtainsOrBlinds"
			treatment-section-type="door"
		/>
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceDoors')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>