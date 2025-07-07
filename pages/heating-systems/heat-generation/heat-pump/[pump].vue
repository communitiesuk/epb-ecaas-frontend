<script setup lang="ts">
import { objectFromEntries } from 'ts-extras';
import { v4 as uuidv4 } from 'uuid';
import { displayProduct } from '~/utils/display';

const title = "Heat pump";
const store = useEcaasStore();
const { saveToList } = useForm();

const heatPumpData = useItemToEdit('pump', store.heatingSystems.heatGeneration.heatPump.data);
const model: Ref<HeatPumpData> = ref(heatPumpData!);

const { data: heatPumps } = await useFetch('/api/products', { query: { category: 'heatPump' } });

const heatPumpOptions = objectFromEntries(heatPumps.value!.map(entity => [entity.reference, displayProduct(entity.product)]));

const saveForm = (fields: HeatPumpData) => {
	store.$patch((state) => {
		const {heatPump} = state.heatingSystems.heatGeneration;

		const heatPumpItem: HeatPumpData = {
			id: uuidv4(),
			name: fields.name,
			productReference: fields.productReference,
		};

		saveToList(heatPumpItem, heatPump);
		heatPump.complete = false;
	});

	navigateTo("/heating-systems/heat-generation");
};

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
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>