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

const roofTypeOptions: Record<Exclude<RoofType, "unheatedPitched">, string | RadioOption> = {
	flat: {
		label: "Flat roof",
		hint: "This assumes the pitch is 0°",
	},
	pitchedInsulatedAtRoof: "Pitched roof insulated at roof or rafter",
	pitchedInsulatedAtCeiling: "Pitched roof insulated at ceiling or joist",
};
const colourOptions = colourOptionsMap;

const saveForm = (fields: RoofData) => {
	store.$patch((state) => {
		const { dwellingSpaceRoofs } = state.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
		const index = getStoreIndex(dwellingSpaceRoofs.data);
		const currentId = roofData?.data.id;
		let variantFields: 
		| {
			typeOfRoof: "pitchedInsulatedAtRoof" | "pitchedInsulatedAtCeiling" | "flat";
			thermalResistance: number;
		} | {
			typeOfRoof: "unheatedPitched";
			uValue: number;
		};;

		switch (fields.typeOfRoof) {
			case "pitchedInsulatedAtRoof":
			case "pitchedInsulatedAtCeiling":
			case "flat":
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
		if (newData?.typeOfRoof === "flat") return; 
		if ([0, 180].includes(newData.pitch!)) {
			const { dwellingSpaceExternalGlazedDoor, dwellingSpaceExternalUnglazedDoor } = store.dwellingFabric.dwellingSpaceDoors;
			const doors = [dwellingSpaceExternalGlazedDoor.data, dwellingSpaceExternalUnglazedDoor.data].flat();
			
			convertFrontDoorToRegularDoor(doors as EcaasForm<ExternalGlazedDoorData | ExternalUnglazedDoorData>[], roofs as EcaasForm<RoofData>[], index);
			useBanner().value = { type: "update-front-door" };
		}
	}
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
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
		<FieldsPitch
			v-if="model?.typeOfRoof === 'flat'"
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

		<FormKit
			id="length"
			type="govInputWithSuffix"
			label="Length of roof"
			help="Enter the length of the building element"
			name="length"
			validation="required | number | min:0.001 | max:50"
			suffix-text="m"
			data-field="Zone.BuildingElement.*.height"
		/>
		<FormKit
			id="width"
			type="govInputWithSuffix"
			label="Width of roof"
			help="Enter the width of the building element"
			name="width"
			validation="required | number | min:0.001 | max:50"
			suffix-text="m"
		/>
		<FieldsElevationalHeight
			field="elevationalHeightOfElement"
			label="Elevational height of roof at its base"
		/>
		<FormKit
			id="surfaceArea"
			type="govInputWithSuffix"
			label="Net surface area of ceiling"
			help="Enter the net area of the building element. The area of all windows or doors should be subtracted before entry."
			name="surfaceArea"
			validation="required | number | min:0.01 | max:10000"
			suffix-text="m²"
			data-field="Zone.BuildingElement.*.area"
		/>
		<FormKit
			id="colour"
			type="govRadios"
			label="Colour of external surface"
			name="colour"
			:options="colourOptions"
			validation="required"
			data-field="Zone.BuildingElement.*.colour"
		/>

		<template v-if="model?.typeOfRoof === 'flat' || model?.typeOfRoof === 'pitchedInsulatedAtRoof'">
			
			<FieldsThermalResistance/>
			<FieldsArealHeatCapacity
				id="arealHeatCapacity"
				name="arealHeatCapacity"
				help="This is the sum of the heat capacities of all the construction layers in the roof and ceiling; also known as effective areal heat capacity or kappa value"
			/>
			<FieldsMassDistributionClass help="This is the distribution of mass in the roof and ceiling" />
		</template>

		<template v-if="model?.typeOfRoof === 'pitchedInsulatedAtCeiling'">
			<FieldsThermalResistance/>
			<FieldsArealHeatCapacity
				id="arealHeatCapacity"
				name="arealHeatCapacity"
				help="This is the sum of the heat capacities of all the construction layers in the roof, loft space and ceiling; also known as effective areal heat capacity or kappa value"
			/>
			<FieldsMassDistributionClass help="This is the distribution of mass in the roof, loft space and ceiling" />
		</template>
		
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('dwellingSpaceCeilingsAndRoofs')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>