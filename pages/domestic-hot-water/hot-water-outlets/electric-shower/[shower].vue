<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { getUrl  } from '#imports';
 
const title = "Electric shower";
const store = useEcaasStore();
const route = useRoute();

const electricShowerData = useItemToEdit('shower', store.domesticHotWater.hotWaterOutlets.electricShower.data);
const model: Ref<ElectricShowerData | undefined> = ref(electricShowerData?.data);

const saveForm = (fields: ElectricShowerData) => {
	store.$patch((state) => {
		const {electricShower} = state.domesticHotWater.hotWaterOutlets;
		const storeData = store.domesticHotWater.hotWaterOutlets.electricShower.data;
		
		const index = route.params.shower === 'create' ? storeData.length - 1 : Number(route.params.shower);

		const electricShowerItem: EcaasForm<ElectricShowerData> = {
			data : {
				id: electricShowerData ? electricShowerData.data.id : uuidv4(),
				name: fields.name,
				ratedPower: fields.ratedPower,
			},
			complete: true
		};
		electricShower.data[index] = electricShowerItem;
		electricShower.complete = false;
	});

	navigateTo("/domestic-hot-water/hot-water-outlets");
};
watch(model, async (newData: ElectricShowerData | undefined, initialData: ElectricShowerData | undefined) => {
	const storeData = store.domesticHotWater.hotWaterOutlets.electricShower.data;

	if (initialData === undefined || newData === undefined) {
		return;
	}

	const defaultName = 'Electric shower';
	const duplicates = storeData.filter(x => x.data.name.match(duplicateNamePattern(defaultName)));

	const isFirstEdit = Object.values(initialData).every(x => x === undefined) &&
		Object.values(newData).some(x => x !== undefined);

	if (route.params.shower === 'create' && isFirstEdit) {

		store.$patch(state => {
			state.domesticHotWater.hotWaterOutlets.electricShower.data.push({
				data: {
					...newData,
					name: newData.name?.trim() || (duplicates.length ? `${defaultName} (${duplicates.length})` : defaultName)
				}
			});
		});

		return;
	}

	store.$patch((state) => {
		const index = route.params.shower === 'create' ? storeData.length - 1 : Number(route.params.shower);

		state.domesticHotWater.hotWaterOutlets.electricShower.data[index] = {
			data: {
				...newData,
				name: newData.name?.trim() || defaultName,
				id: store.domesticHotWater.hotWaterOutlets.electricShower.data[index]?.data.id ?? uuidv4()
			}
		};

		state.domesticHotWater.hotWaterOutlets.electricShower.complete = false;
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
		<GovErrorSummary :error-list="errorMessages" test-id="electricShowerErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this shower so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="ratedPower"
			type="govInputWithSuffix"
			label="Rated power"
			name="ratedPower"
			validation="required | number | min:0 | max:30"
			suffix-text="kW"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('hotWaterOutlets')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>