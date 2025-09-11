<script setup lang="ts">
import { AdjacentSpaceType } from "~/stores/ecaasStore.schema";
import { getUrl } from "#imports";

const title = "Internal floor";
const store = useEcaasStore();
const { getStoreIndex, autoSaveElementForm } = useForm();

const floorData = useItemToEdit("floor", store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor?.data);
const model = ref(floorData?.data);

const typeOfInternalFloorOptions = adjacentSpaceTypeOptions("Internal floor");

const saveForm = (fields: InternalFloorData) => {
	store.$patch((state) => {
		const { dwellingSpaceFloors } = state.dwellingFabric;

		const commonFields = {
			name: fields.name,
			surfaceAreaOfElement: fields.surfaceAreaOfElement,
			kappaValue: fields.kappaValue,
			massDistributionClass: fields.massDistributionClass,
		};

		let floor: InternalFloorData;

		if (fields.typeOfInternalFloor === "unheatedSpace") {
			floor = {
				...commonFields,
				typeOfInternalFloor: fields.typeOfInternalFloor,
				thermalResistanceOfAdjacentUnheatedSpace: fields.thermalResistanceOfAdjacentUnheatedSpace,
			
			};
		} else if (fields.typeOfInternalFloor === "heatedSpace") {
			floor = {
				...commonFields,
				typeOfInternalFloor: fields.typeOfInternalFloor,
			};
		} else {
			throw new Error("Invalid floor type");
		}
		
		const index = getStoreIndex(dwellingSpaceFloors.dwellingSpaceInternalFloor.data);
		dwellingSpaceFloors.dwellingSpaceInternalFloor.data[index] =  { data: floor, complete: true };
		dwellingSpaceFloors.dwellingSpaceInternalFloor.complete = false;
	});
	navigateTo("/dwelling-fabric/floors");
};

autoSaveElementForm<InternalFloorData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor,
	defaultName: "Internal floor",
	onPatchCreate: (state, newData) => {
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor.data.push(newData);
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor.complete = false;
	},
	onPatchUpdate: (state, newData, index) => {
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor.data[index] = newData;
		state.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor.complete = false;
	},
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
		<GovErrorSummary :error-list="errorMessages" test-id="internalFloorErrorSummary"/>
		<FormKit
			id="typeOfInternalFloor"
			type="govRadios"
			:options="typeOfInternalFloorOptions"
			label="Type of internal floor"
			help="This affects the additional inputs needed"
			name="typeOfInternalFloor"
			validation="required"
		/>
		<template v-if="!!model?.typeOfInternalFloor">
			<FormKit
				id="name"
				type="govInputText"
				label="Name"
				help="Provide a name for this element so that it can be identified later"
				name="name"
				validation="required"
			/>
			<FormKit
				id="surfaceAreaOfElement"
				type="govInputWithSuffix"
				label="Net surface area of the floor"
				name="surfaceAreaOfElement"
				validation="required | number | min:0 | max:10000"
				suffix-text="m²"
			/>
			<FieldsArealHeatCapacity id="kappaValue" name="kappaValue"/>
			<FieldsMassDistributionClass id="massDistributionClass" name="massDistributionClass"/>
		</template>
		<FormKit
			v-if="model?.typeOfInternalFloor === AdjacentSpaceType.unheatedSpace"
			id="thermalResistanceOfAdjacentUnheatedSpace"
			type="govInputWithSuffix"
			suffix-text="(m²·K)/W"
			label="Thermal resistance of adjacent unheated space"
			help="Enter the effective thermal resistance of the unheated space"
			name="thermalResistanceOfAdjacentUnheatedSpace"
			validation="required | number | min:0 | max:3"
		>
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<p>For example values please refer to the technical paper S11P-028. The maximum value in this paper is 2.5 (m²·K)/W for when the facing wall is not exposed.</p>
				<p class="govuk-body">
					<a href="/guidance/unheated-space-guidance" target="_blank" class="govuk-link">					
						Guidance on thermal resistance of unheated spaces (opens in another window)
					</a>
				</p>
			</GovDetails>
		</FormKit>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceFloors')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>