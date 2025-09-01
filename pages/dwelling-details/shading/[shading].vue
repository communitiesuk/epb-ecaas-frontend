<script setup lang="ts">
import type { ShadingObjectType } from '~/schema/api-schema.types';
import { getUrl, type ShadingData } from "#imports";

const title = "Distant shading";
const store = useEcaasStore();
const route = useRoute();

const shadingData = useItemToEdit('shading', store.dwellingDetails.shading.data);
const model: Ref<ShadingData | undefined> = ref(shadingData?.data);

const objectTypeOptions: Record<ShadingObjectType, Capitalize<ShadingObjectType>> = {
	obstacle: 'Obstacle',
	overhang: 'Overhang',
};

const saveForm = (fields: ShadingData) => {
	store.$patch((state) => {
		const storeData = state.dwellingDetails.shading.data;

		const index = route.params.shading === 'create' ? storeData.length - 1 : Number(route.params.shading);

		const shadingItem: EcaasForm<ShadingData> = {
			data: {
				name: fields.name,
				startAngle: fields.startAngle,
				endAngle: fields.endAngle,
				objectType: fields.objectType,
				height: fields.height,
				distance: fields.distance
			},
			complete: true
		};

		state.dwellingDetails.shading.data[index] = shadingItem;
		state.dwellingDetails.shading.complete = false;
	});

	navigateTo("/dwelling-details/shading");
};

watch(model, async (newData: ShadingData | undefined, initialData: ShadingData | undefined) => {
	const storeData = store.dwellingDetails.shading.data;

	if (initialData === undefined || newData === undefined) {
		return;
	}

	const defaultName = 'Shading';
	const duplicates = storeData.filter(x => x.data.name.match(duplicateNamePattern(defaultName)));

	const isFirstEdit = Object.values(initialData).every(x => x === undefined) &&
		Object.values(newData).some(x => x !== undefined);

	if (route.params.shading === 'create' && isFirstEdit) {

		store.$patch(state => {
			state.dwellingDetails.shading.data.push({
				data: {
					...newData,
					name: newData.name || (duplicates.length ? `${defaultName} (${duplicates.length})` : defaultName)
				}
			});
		});

		return;
	}

	store.$patch((state) => {
		const index = route.params.shading === 'create' ? storeData.length - 1 : Number(route.params.shading);

		state.dwellingDetails.shading.data[index] = {
			data: {
				...newData,
				name: newData.name ?? state.dwellingDetails.shading.data[index]?.data.name
			}
		};

		state.dwellingDetails.shading.complete = false;
	});
});

const {handleInvalidSubmit, errorMessages} = useErrorSummary();
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
			<GovButton :href="getUrl('heatEmitting')" secondary>Save progress</GovButton>
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
