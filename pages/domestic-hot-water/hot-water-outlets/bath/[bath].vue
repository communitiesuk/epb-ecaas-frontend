<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { getUrl  } from '#imports';

const title = "Bath";
const store = useEcaasStore();
const route = useRoute();

const bathData = useItemToEdit('bath', store.domesticHotWater.hotWaterOutlets.bath.data);
const model: Ref<BathData | undefined> = ref(bathData?.data);

const saveForm = (fields: BathData) => {

	store.$patch((state) => {
		const {bath} = state.domesticHotWater.hotWaterOutlets;
		const storeData = store.domesticHotWater.hotWaterOutlets.bath.data;

		const index = route.params.bath === 'create' ? storeData.length - 1 : Number(route.params.bath);

		const bathItem: EcaasForm<BathData> = {
			data: {
				id: bathData ? bathData.data.id :uuidv4(),
				name: fields.name,
				size: fields.size,
				flowRate: fields.flowRate
			},
			complete: true
		};

		bath.data[index] = bathItem;
		bath.complete = false;
	});

	navigateTo("/domestic-hot-water/hot-water-outlets");
};

watch(model, async (newData: BathData | undefined, initialData: BathData | undefined) => {
	const storeData = store.domesticHotWater.hotWaterOutlets.bath.data;

	if (initialData === undefined || newData === undefined) {
		return;
	}

	const defaultName = 'Bath';
	const duplicates = storeData.filter(x => x.data.name.match(duplicateNamePattern(defaultName)));

	const isFirstEdit = Object.values(initialData).every(x => x === undefined) &&
		Object.values(newData).some(x => x !== undefined);

	if (route.params.bath === 'create' && isFirstEdit) {

		store.$patch(state => {
			state.domesticHotWater.hotWaterOutlets.bath.data.push({
				data: {
					...newData,
					name: newData.name || (duplicates.length ? `${defaultName} (${duplicates.length})` : defaultName),
				}
			});
		});

		return;
	}

	store.$patch((state) => {
		const index = route.params.bath === 'create' ? storeData.length - 1 : Number(route.params.bath);

		state.domesticHotWater.hotWaterOutlets.bath.data[index] = {
			data: {
				...newData,
				name: newData.name ?? state.domesticHotWater.hotWaterOutlets.bath.data[index]?.data.name,
				id: store.domesticHotWater.hotWaterOutlets.bath.data[index]?.data.id ?? uuidv4()
			}
		};

		state.domesticHotWater.hotWaterOutlets.bath.complete = false;
	});
});

const {handleInvalidSubmit, errorMessages} = useErrorSummary();
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
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="bathErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this bath so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="size"
			type="govInputWithSuffix"
			label="Size"
			name="size"
			validation="required | number | min:0 | max:500"
			suffix-text="litres"
		/>
		<FormKit
			id="flowRate"
			type="govInputWithSuffix"
			label="Flow rate"
			name="flowRate"
			validation="required | number | min:0 | max:15"
			suffix-text="litres per minute"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('hotWaterOutlets')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>