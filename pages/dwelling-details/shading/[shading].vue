<script setup lang="ts">
import type { SchemaShadingObjectType } from "~/schema/api-schema.types";
import { getUrl, type ShadingData } from "#imports";

const title = "Distant shading";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const shadingData = useItemToEdit("shading", store.dwellingDetails.shading.data);
const model = ref(shadingData?.data);

const objectTypeOptions: Record<SchemaShadingObjectType, Capitalize<SchemaShadingObjectType>> = {
	obstacle: "Obstacle",
	overhang: "Overhang",
};

const saveForm = (fields: ShadingData) => {
	store.$patch((state) => {
		const { shading } = state.dwellingDetails;
		const index = getStoreIndex(shading.data);

		shading.data[index] = {
			data: {
				name: fields.name,
				startAngle: fields.startAngle,
				endAngle: fields.endAngle,
				objectType: fields.objectType,
				height: fields.height,
				distance: fields.distance,
			},
			complete: true,
		};
		shading.complete = false;
	});

	navigateTo("/dwelling-details/shading");
};

autoSaveElementForm<ShadingData>({
	model,
	storeData: store.dwellingDetails.shading,
	defaultName: "Shading",
	onPatch: (state, newData, index) => {
		state.dwellingDetails.shading.data[index] = newData;
		state.dwellingDetails.shading.complete = false;
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
	<p class="govuk-body">
		<a href="/guidance/calculating-distant-shading" target="_blank" class="govuk-link">Guidance on shading (opens in another window)</a>
	</p>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary
			:error-list="errorMessages"
			test-id="ShadingErrorSummary"
		/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="startAngle"
			type="govInputWithSuffix"
			label="Shading start angle"
			help="This is the absolute start angle from compass north of the segment"
			name="startAngle"
			validation="required | number | min:0 | max:360"
			suffix-text="°"
		/>
		<FormKit
			id="endAngle"
			type="govInputWithSuffix"
			label="Shading end angle"
			help="This is the absolute end angle from compass north of the segment clockwise from the start angle. The end angle must be greater than the start angle."
			name="endAngle"
			validation="required | number | min:0 | max:360"
			suffix-text="°"
		/>
		<FormKit
			id="objectType"
			type="govRadios"
			label="Object Type"
			help="Select the type of object causing the shading"
			name="objectType"
			:options="objectTypeOptions"
			validation="required">
			<GovDetails summary-text="Help with this input">
				<ul class="govuk-list govuk-list--bullet">
					<li>An obstacle (for example, a tree or building) ends at a certain height above ground level.</li>
					<li>An overhang (for example, a roof or balcony) starts at a certain height above ground level.</li>
				</ul>
				<img src="/img/overhang-and-obstacle.png" alt="Overhang and obstacle">
			</GovDetails>
		</FormKit>
		<FormKit
			id="height"
			type="govInputWithSuffix"
			label="Height"
			suffix-text="m"
			name="height"
			validation="required | number"
			help="Enter the height of the object causing the shading"
		/>
		<FormKit
			id="distance"
			type="govInputWithSuffix"
			label="Distance"
			suffix-text="m"
			name="distance"
			validation="required | number"
			help="Enter the distance from the dwelling to the shading object"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('shading')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>

<style scoped lang="scss">
.summary-text {
  white-space: pre-wrap;
}

.h2 {
  padding-top: 40px;
}
</style>
