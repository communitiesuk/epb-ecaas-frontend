<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { getUrl  } from '#imports';

const title = "Other outlets";
const store = useEcaasStore();
const route = useRoute();

const otherOutletsData = useItemToEdit('outlet', store.domesticHotWater.hotWaterOutlets.otherOutlets.data);
const model: Ref<OtherHotWaterOutletData | undefined> = ref(otherOutletsData?.data);

const saveForm = (fields: OtherHotWaterOutletData) => {
	store.$patch((state) => {
		const {otherOutlets} = state.domesticHotWater.hotWaterOutlets;
		const storeData = store.domesticHotWater.hotWaterOutlets.otherOutlets.data;
		
		const index = route.params.outlet === 'create' ? storeData.length - 1 : Number(route.params.outlet);

		const outletItem: EcaasForm<OtherHotWaterOutletData> = {
			data: {
				id: otherOutletsData ? otherOutletsData.data.id : uuidv4(),
				name: fields.name,
				flowRate: fields.flowRate,
			},
			complete: true
		};

		otherOutlets.data[index] = outletItem;
		otherOutlets.complete = false;
	});

	navigateTo("/domestic-hot-water/hot-water-outlets");
};

watch(model, async (newData: OtherHotWaterOutletData | undefined, initialData: OtherHotWaterOutletData | undefined) => {
	const storeData = store.domesticHotWater.hotWaterOutlets.otherOutlets.data;

	if (initialData === undefined || newData === undefined) {
		return;
	}

	const defaultName = 'Other outlet';
	const duplicates = storeData.filter(x => x.data.name.match(duplicateNamePattern(defaultName)));

	const isFirstEdit = Object.values(initialData).every(x => x === undefined) &&
		Object.values(newData).some(x => x !== undefined);

	if (route.params.outlet === 'create' && isFirstEdit) {

		store.$patch(state => {
			state.domesticHotWater.hotWaterOutlets.otherOutlets.data.push({
				data: {
					...newData,
					name: newData.name || (duplicates.length ? `${defaultName} (${duplicates.length})` : defaultName)
				}
			});
		});

		return;
	}

	store.$patch((state) => {
		const index = route.params.outlet === 'create' ? storeData.length - 1 : Number(route.params.outlet);

		state.domesticHotWater.hotWaterOutlets.otherOutlets.data[index] = {
			data: {
				...newData,
				name: newData.name ?? state.domesticHotWater.hotWaterOutlets.electricShower.data[index]?.data.name,
				id: store.domesticHotWater.hotWaterOutlets.otherOutlets.data[index]?.data.id ?? uuidv4()
			}
		};

		state.domesticHotWater.hotWaterOutlets.otherOutlets.complete = false;
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
		<GovErrorSummary :error-list="errorMessages" test-id="otherOutletsErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this outlet so that it can be identified later"
			name="name"
			validation="required"
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