<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { getUrl  } from '#imports';

const title = "Mixer shower";
const store = useEcaasStore();
const route = useRoute();

const mixedShowerData = useItemToEdit('shower', store.domesticHotWater.hotWaterOutlets.mixedShower.data);
const model: Ref<MixedShowerData | undefined > = ref(mixedShowerData?.data      );

const saveForm = (fields: MixedShowerData) => {
	store.$patch((state) => {
		const {mixedShower} = state.domesticHotWater.hotWaterOutlets;
		const storeData = store.domesticHotWater.hotWaterOutlets.mixedShower.data;
		
		const index = route.params.shower === 'create' ? storeData.length - 1 : Number(route.params.shower);

		const mixedShowerItem: EcaasForm<MixedShowerData> = {
			data: {
				id: mixedShowerData ? mixedShowerData.data.id : uuidv4(),
				name: fields.name,
				flowRate: fields.flowRate,
			},
			complete: true
		};

		mixedShower.data[index] = mixedShowerItem;
		mixedShower.complete = false;
	});

	navigateTo("/domestic-hot-water/hot-water-outlets");
};

watch(model, async (newData: MixedShowerData | undefined, initialData: MixedShowerData | undefined) => {
	const storeData = store.domesticHotWater.hotWaterOutlets.mixedShower.data;

	if (initialData === undefined || newData === undefined) {
		return;
	}

	const defaultName = 'Mixer shower';
	const duplicates = storeData.filter(x => x.data.name.match(duplicateNamePattern(defaultName)));

	const isFirstEdit = Object.values(initialData).every(x => x === undefined) &&
		Object.values(newData).some(x => x !== undefined);

	if (route.params.shower === 'create' && isFirstEdit) {

		store.$patch(state => {
			state.domesticHotWater.hotWaterOutlets.mixedShower.data.push({
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

		state.domesticHotWater.hotWaterOutlets.mixedShower.data[index] = {
			data: {
				...newData,
				name: newData.name?.trim() || defaultName,
				id: store.domesticHotWater.hotWaterOutlets.mixedShower.data[index]?.data.id ?? uuidv4()
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
		<GovErrorSummary :error-list="errorMessages" test-id="mixedShowerErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this shower so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="flowRate"
			type="govInputWithSuffix"
			label="Flow rate"
			name="flowRate"
			validation="required | number | min:8 | max:15"
			suffix-text="litres per minute"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('hotWaterOutlets')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>