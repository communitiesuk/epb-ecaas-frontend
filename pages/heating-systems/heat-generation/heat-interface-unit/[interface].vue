<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const title = "Heat interface unit";
const store = useEcaasStore();
const { saveToList } = useForm();

const heatInterfaceUnitData = useItemToEdit('interface', store.heatingSystems.heatGeneration.heatInterfaceUnit.data);
const model: Ref<HeatInterfaceUnitData> = ref(heatInterfaceUnitData!);

const saveForm = (fields: HeatInterfaceUnitData) => {
	store.$patch((state) => {
		const { heatInterfaceUnit } = state.heatingSystems.heatGeneration;

		const heatInterfaceUnitItem: HeatInterfaceUnitData = {
			id: uuidv4(),
			name: fields.name
		};

		saveToList(heatInterfaceUnitItem, heatInterfaceUnit);
		heatInterfaceUnit.complete = false;
	});

	navigateTo("/heating-systems/heat-generation");
};

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
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="heatInterfaceUnitErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this heat interface unit so that it can be identified later"
			name="name"
			validation="required"
		/>
		<GovLLMWarning />
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>