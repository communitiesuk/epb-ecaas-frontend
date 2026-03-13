<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { getUrl, zeroPitchOptions, uniqueName, type RoofData } from "#imports";
import type { RadioOption } from "~/components/form-kit/Radios.vue";

const title = "Roof";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();
const roofs = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs?.data;
const index = getStoreIndex(roofs);
const roofData = useItemToEdit("roof", roofs);
const roofId = roofData?.data.id ?? uuidv4();
const model = ref(roofData?.data);

type ActiveRoofType = Exclude<RoofType, "unheatedPitched">;

const roofFieldText: Record<ActiveRoofType, {
	lengthLabel: string;
	lengthHelp: string;
	widthLabel: string;
	widthHelp: string;
	elevationalHelp: string;
	surfaceAreaHelp: string;
	thermalResistanceHelp: string;
	arealHeatCapacityHelp: string;
	massDistributionHelp: string;
}> = {
	flatAboveHeatedSpace: {
		lengthLabel: "Length of internal ceiling",
		lengthHelp: "Enter the length of the internal adjacent ceiling",
		widthLabel: "Width of internal ceiling",
		widthHelp: "Enter the width of the internal adjacent ceiling",
		elevationalHelp: "Enter the distance between the ground and the external surface of the roof",
		surfaceAreaHelp: "Enter the net area of the internal adjacent ceiling. The area of all windows should be subtracted before entry. You do not need to subtract the area of PV arrays.",
		thermalResistanceHelp: "Enter the thermal resistance of the adjacent ceiling and roof build-up from the structural deck to the top waterproof layer",
		arealHeatCapacityHelp: "This is the sum of the heat capacities of all the construction layers in the ceiling and roof build up from the structural deck to the top waterproof layer",
		massDistributionHelp: "This is the distribution of mass in the ceiling and roof build up from the structural deck to the top waterproof layer",
	},
	flatAboveUnheatedSpace: {
		lengthLabel: "Length of internal ceiling",
		lengthHelp: "Enter the length of the internal ceiling",
		widthLabel: "Width of internal ceiling",
		widthHelp: "Enter the width of the internal ceiling",
		elevationalHelp: "Enter the distance between the ground and the external surface of the roof",
		surfaceAreaHelp: "Enter the net area of the internal ceiling. You do not need to subtract the areas of windows or rooflights that are in the roof above the unheated space.",
		thermalResistanceHelp: "Enter the thermal resistance of the adjacent ceiling, roof build-up from the structural deck to the top waterproof layer, and unheated space",
		arealHeatCapacityHelp: "This is the sum of the heat capacities of all the construction layers in the ceiling but not the roof",
		massDistributionHelp: "This is the distribution of mass in the roof, loft space and ceiling",
	},
	pitchedInsulatedAtRoof: {
		lengthLabel: "Length of roof",
		lengthHelp: "Enter the length of the exposed area of roof looking from the inside",
		widthLabel: "Width of roof",
		widthHelp: "Enter the width of the exposed area of roof looking from the inside",
		elevationalHelp: "Enter the distance between the ground and the lowest point of the length measurement",
		surfaceAreaHelp: "Enter the net area of the internal adjacent ceiling. The area of all windows should be subtracted before entry. You do not need to subtract the area of PV arrays.",
		thermalResistanceHelp: "Enter the thermal resistance of the adjacent ceiling and roof build-up from the structural deck to the top waterproof layer",
		arealHeatCapacityHelp: "This is the sum of the heat capacities of all the construction layers in the ceiling and roof build up from the structural deck to the top waterproof layer",
		massDistributionHelp: "This is the distribution of mass in the ceiling and roof build up from the structural deck to the top waterproof layer",
	},
	pitchedInsulatedAtCeiling: {
		lengthLabel: "Length of internal ceiling",
		lengthHelp: "Enter the length of the internal ceiling",
		widthLabel: "Width of internal ceiling",
		widthHelp: "Enter the width of the internal ceiling",
		elevationalHelp: "Enter the distance between the ground and the lowest point of the length measurement",
		surfaceAreaHelp: "Enter the net area of the internal ceiling. You do not need to subtract the areas of windows or rooflights that are in the roof above the unheated space.",
		thermalResistanceHelp: "Enter the thermal resistance of the adjacent ceiling, roof build-up from the structural deck to the top waterproof layer, and unheated space",
		arealHeatCapacityHelp: "This is the sum of the heat capacities of all the construction layers in the ceiling but not the roof",
		massDistributionHelp: "This is the distribution of mass in the roof, loft space and ceiling",
	},
};

const roofTypeOptions: Record<ActiveRoofType, string | RadioOption> = {
	flatAboveHeatedSpace: {
		label: "Flat roof above a heated space",
		hint: "This assumes the pitch is 0°",
	},
	flatAboveUnheatedSpace: {
		label: "Flat roof above an unheated space",
		hint: "This assumes the pitch is 0°",
	},
	pitchedInsulatedAtRoof: "Pitched roof insulated at roof or rafter",
	pitchedInsulatedAtCeiling: "Pitched roof insulated at ceiling or joist",
};


const saveForm = (fields: RoofData) => {
	store.$patch((state) => {
		const { dwellingSpaceRoofs } = state.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
		const index = getStoreIndex(dwellingSpaceRoofs.data);
		const currentId = roofData?.data.id;
		let variantFields: 
		| {
			typeOfRoof: "pitchedInsulatedAtRoof" | "pitchedInsulatedAtCeiling" | "flatAboveHeatedSpace" | "flatAboveUnheatedSpace";
			thermalResistance: number;
		} | {
			typeOfRoof: "unheatedPitched";
			uValue: number;
		};;

		switch (fields.typeOfRoof) {
			case "pitchedInsulatedAtRoof":
			case "pitchedInsulatedAtCeiling":
			case "flatAboveHeatedSpace":
			case "flatAboveUnheatedSpace":
				variantFields = {
					typeOfRoof: fields.typeOfRoof,
					thermalResistance: fields.thermalResistance,
				};
				break;

			case "unheatedPitched":
				variantFields = {
					typeOfRoof: fields.typeOfRoof,
					uValue: fields.uValue,
				};
				break;

			default:
				variantFields = undefined as never;
		}

		dwellingSpaceRoofs.data[index] = {
			data: {
				id: currentId || uuidv4(),
				name: fields.name,
				...variantFields,
				pitchOption: fields.pitchOption,
				pitch: fields.pitchOption === "0" ? 0 : fields.pitch,
				orientation: fields.orientation,
				length: fields.length,
				width: fields.width,
				elevationalHeightOfElement: fields.elevationalHeightOfElement,
				surfaceArea: fields.surfaceArea,
				colour: fields.colour,
				arealHeatCapacity: fields.arealHeatCapacity,
				massDistributionClass: fields.massDistributionClass,
			},
			complete: true,
		};
		dwellingSpaceRoofs.complete = false;
	});

	navigateTo("/dwelling-fabric/ceilings-and-roofs");
};

autoSaveElementForm<RoofData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs,
	defaultName: "Roof",
	onPatch: (state, newData, index) => {
		newData.data.id ??= roofId;
		state.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.data[index] = newData;
		state.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.complete = false;
	},
});

watch(model, (newData, initialData) => {
	if (initialData === undefined || initialData === newData) return; 
	if (newData) {
		if (newData?.typeOfRoof === "flatAboveHeatedSpace" || newData?.typeOfRoof === "flatAboveUnheatedSpace") return; 
		if ([0, 180].includes(newData.pitch!)) {
			const { dwellingSpaceExternalGlazedDoor, dwellingSpaceExternalUnglazedDoor } = store.dwellingFabric.dwellingSpaceDoors;
			const doors = [dwellingSpaceExternalGlazedDoor.data, dwellingSpaceExternalUnglazedDoor.data].flat();
			
			convertFrontDoorToRegularDoor(doors as EcaasForm<ExternalGlazedDoorData | ExternalUnglazedDoorData>[], roofs as EcaasForm<RoofData>[], index);
			useBanner().value = { type: "update-front-door" };
		}
	}
});

const currentRoofFieldText = computed(() => {
	if (model.value?.typeOfRoof && model.value.typeOfRoof !== "unheatedPitched") {
		return roofFieldText[model.value.typeOfRoof];
	}
	return null;
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<ClientOnly>
		<FormKit
			v-model="model"
			type="form"
			:actions="false"
			:incomplete-message="false"
			@submit="saveForm"
			@submit-invalid="handleInvalidSubmit"
		>
			<GovErrorSummary :error-list="errorMessages" test-id="roofErrorSummary"/>
			<FormKit
				id="name"
				type="govInputText"
				label="Name"
				help="Provide a name for this element so that it can be identified later"
				name="name"
				:validation-rules="{ uniqueName: uniqueName(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.data, { index }) }"
				validation="required | uniqueName"
				:validation-messages="{
					uniqueName: 'An element with this name already exists. Please enter a unique name.'
				}"
			/>
			<FormKit
				id="typeOfRoof"
				type="govRadios"
				:options="roofTypeOptions"
				label="Type of roof"
				name="typeOfRoof"
				validation="required"
			/>
			<GovInset v-if="model?.typeOfRoof === 'pitchedInsulatedAtRoof' || model?.typeOfRoof === 'pitchedInsulatedAtCeiling'">
				If the pitched roof has multiple orientations (for example, a gable or hip roof), each orientation must be added as a separate roof element.
			</GovInset>
			<FieldsThermalResistance :key="`thermalResistance-${model?.typeOfRoof}`" :help="currentRoofFieldText?.thermalResistanceHelp" />
			<FieldsColourOfExternalSurface />	
			<FieldsArealHeatCapacity
				id="arealHeatCapacity"
				:key="`arealHeatCapacity-${model?.typeOfRoof}`"
				name="arealHeatCapacity"
				:help="currentRoofFieldText?.arealHeatCapacityHelp"
			/>
			<FieldsMassDistributionClass :key="`massDistributionClass-${model?.typeOfRoof}`" :help="currentRoofFieldText?.massDistributionHelp" />
			<FieldsPitch
				v-if="model?.typeOfRoof === 'flatAboveHeatedSpace' || model?.typeOfRoof === 'flatAboveUnheatedSpace'"
				label="Pitch of roof"
				help="Enter the tilt angle of the external surface of the roof. 0° means the external surface is facing up like ceilings, and 180° means the external surface is facing down like floors."
				:options="zeroPitchOptions()"
				:pitch-option="model?.pitchOption"
				data-field="Zone.BuildingElement.*.pitch"
			/>

			<template v-if="model?.typeOfRoof === 'pitchedInsulatedAtRoof' || model?.typeOfRoof === 'pitchedInsulatedAtCeiling'">
				<FieldsPitch
					label="Pitch of roof"
					help="Enter the tilt angle of the external surface of the roof. 0° means the external surface is facing up like ceilings, and 180° means the external surface is facing down like floors."
					data-field="Zone.BuildingElement.*.pitch"
				/>
				<FieldsOrientation
					label="Orientation of roof"
					data-field="Zone.BuildingElement.*.orientation"
				/>
				<div v-if="!!model?.orientation" class="govuk-error-summary">
					<div role="alert" class="govuk-hint govuk-!-margin-bottom-0">
						If the pitched roof has multiple orientations (e.g., a gable or hip roof), each orientation must be modelled as a separate roof element.
					</div>
				</div>
			</template>
			<FieldsElevationalHeight
				:key="`elevationalHeight-${model?.typeOfRoof}`"
				field="elevationalHeightOfElement"
				label="Elevational height of roof at its base"
				:help="currentRoofFieldText?.elevationalHelp"
			/>
			<FormKit
				id="length"
				:key="`length-${model?.typeOfRoof}`"
				type="govInputWithSuffix"
				:label="currentRoofFieldText?.lengthLabel ?? 'Length of roof'"
				:help="currentRoofFieldText?.lengthHelp ?? 'Enter the length of the building element'"
				name="length"
				validation="required | number | min:0.001 | max:50"
				suffix-text="m"
				data-field="Zone.BuildingElement.*.height"
			/>
			<FormKit
				id="width"
				:key="`width-${model?.typeOfRoof}`"
				type="govInputWithSuffix"
				:label="currentRoofFieldText?.widthLabel ?? 'Width of roof'"
				:help="currentRoofFieldText?.widthHelp ?? 'Enter the width of the building element'"
				name="width"
				validation="required | number | min:0.001 | max:50"
				suffix-text="m"
			/>
			<FormKit
				id="surfaceArea"
				:key="`surfaceArea-${model?.typeOfRoof}`"
				type="govInputWithSuffix"
				label="Net surface area of ceiling"
				:help="currentRoofFieldText?.surfaceAreaHelp ?? 'Enter the net area of the building element. The area of all windows or doors should be subtracted before entry.'"
				name="surfaceArea"
				validation="required | number | min:0.01 | max:10000"
				suffix-text="m²"
				data-field="Zone.BuildingElement.*.area"
			/>		
			<GovLLMWarning />
			<div class="govuk-button-group">
				<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
				<GovButton :href="getUrl('dwellingSpaceCeilingsAndRoofs')" secondary test-id="saveProgress">Save progress</GovButton>
			</div>
		</FormKit>
	</ClientOnly>
</template>