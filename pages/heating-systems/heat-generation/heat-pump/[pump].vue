<script setup lang="ts">
import { objectFromEntries } from 'ts-extras';
import { v4 as uuidv4 } from 'uuid';
import { displayProduct } from '~/utils/display';
import { getUrl } from "#imports";

const title = "Heat pump";
const store = useEcaasStore();
const route = useRoute();
const { saveToList } = useForm();

const heatPumpData = useItemToEdit('pump', store.heatingSystems.heatGeneration.heatPump.data);
const model: Ref<HeatPumpData | undefined> = ref(heatPumpData?.data);

const { data: heatPumps } = await useFetch('/api/products', { query: { category: 'heatPump' } });

// sort into Small, Medium, Large (to retain while we are using test fake heat pumps and don't have better means to sort them by)
heatPumps.value?.sort((a, b) => -a.reference.localeCompare(b.reference));

const heatPumpOptions = objectFromEntries(heatPumps.value!.map(entity => [entity.reference, displayProduct(entity.product)]));

const saveForm = (fields: HeatPumpData) => {
	store.$patch((state) => {
		const {heatPump} = state.heatingSystems.heatGeneration;

		const heatPumpItem: EcaasForm<HeatPumpData> = {
			data: {
				id: heatPumpData ? heatPumpData.data.id : uuidv4(),
				name: fields.name,
				productReference: fields.productReference,
			},
			complete: true
		};

		saveToList(heatPumpItem, heatPump);
		heatPump.complete = false;
	});

	navigateTo("/heating-systems/heat-generation");
};

watch(model, async (newData: HeatPumpData | undefined, initialData: HeatPumpData | undefined) => {
	const storeData = store.heatingSystems.heatGeneration.heatPump.data;

	if (initialData === undefined || newData === undefined) {
		return;
	}

	const defaultName = 'Heat pump';
	const duplicates = storeData.filter(x => x.data.name.match(duplicateNamePattern(defaultName)));

	const isFirstEdit = Object.values(initialData).every(x => x === undefined) &&
		Object.values(newData).some(x => x !== undefined);

	if (route.params.pump === 'create' && isFirstEdit) {
		store.$patch(state => {
			state.heatingSystems.heatGeneration.heatPump.data.push({
				data: {
					...newData,
					name: newData.name || (duplicates.length ? `${defaultName} (${duplicates.length})` : defaultName)
				}
			});
		});

		return;
	}

	store.$patch((state) => {
		const index = route.params.pump === 'create' ? storeData.length - 1 : Number(route.params.pump);

		state.heatingSystems.heatGeneration.heatPump.data[index] = {
			data: {
				...newData,
				name: newData.name ?? state.heatingSystems.heatGeneration.heatPump.data[index]?.data.name
			}
		};

		state.heatingSystems.heatGeneration.heatPump.complete = false;
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
		<GovErrorSummary :error-list="errorMessages" test-id="heatPumpErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this heat pump so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="productReference"
			type="govRadios"
			label="Heat pump"
			:options="heatPumpOptions"
			name="productReference"
			help="For this release you will only be allowed to specify the approximate size of the heat pump. In future releases you will be able to select specific models."
			validation="required"
		/>
		<GovLLMWarning />

		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('heatGeneration')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>