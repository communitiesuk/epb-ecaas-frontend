<script setup lang="ts">
const title = "Point of use";
const store = useEcaasStore();
const { saveToList } = useForm();

const pointOfUseData = useItemToEdit("pointOfUse", store.domesticHotWater.waterHeating.pointOfUse.data);
const model = ref(pointOfUseData?.data);

const saveForm = (fields: PointOfUseData) => {
	store.$patch((state) => {
		const { pointOfUse } = state.domesticHotWater.waterHeating;

		const pointOfUseItem: PointOfUseData = {
			name: fields.name,
			setpointTemperature: fields.setpointTemperature,
			heaterEfficiency: fields.heaterEfficiency,
		};

		const pointOfUseForm: EcaasForm<PointOfUseData> = {
			complete: true,
			data: pointOfUseItem,
		};

		saveToList(pointOfUseForm, pointOfUse);
		pointOfUse.complete = false;
	});

	navigateTo("/domestic-hot-water/water-heating");
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
		<GovErrorSummary :error-list="errorMessages" test-id="pointOfUseErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="setpointTemperature"
			type="govInputWithSuffix"
			label="Setpoint temperature"
			help="Setpoint temperature which the heating system is set to raise the temperature of the hot water. Not recommended to heat above 65 °C due to scalding risk."
			name="setpointTemperature"
			validation="required | number"
			suffix-text="°C">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<p>Typical range 25 - 44</p>
			</GovDetails>
		</FormKit>
		<FormKit
			id="heaterEfficiency"
			type="govInputFloat"
			label="Heater efficiency"
			help="Efficiency of the heater, between 0 and 1"
			name="heaterEfficiency"
			validation="required | number | min:0 | max:1"
		/>
		<GovLLMWarning />
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>