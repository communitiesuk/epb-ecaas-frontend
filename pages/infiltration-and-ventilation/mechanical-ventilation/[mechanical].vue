<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { SupplyAirFlowRateControlType, type MVHRLocation} from '~/schema/api-schema.types';
import { VentType } from '~/schema/api-schema.types';

const title = "Mechanical ventilation";
const mvhrTitle = "MVHR only inputs";
const store = useEcaasStore();
const { saveToList } = useForm();

const mechanicalVentilation = useItemToEdit('mechanical', store.infiltrationAndVentilation.mechanicalVentilation.data);
const model: Ref<MechanicalVentilationData> = ref(mechanicalVentilation!);

/** 'PIV' is excluded from options here because it is in the schema currently but unsupported in HEM itself at 0.34 version */
const ventTypeOptions: Record<Exclude<VentType, 'PIV'>, string> = {
	[VentType.MVHR]: 'MVHR',
	[VentType.Intermittent_MEV]: 'Intermittent MEV',
	[VentType.Centralised_continuous_MEV]: 'Centralised continuous MEV',
	[VentType.Decentralised_continuous_MEV]: 'Decentralised continuous MEV',
};

const mvhrLocationOptions: Record<MVHRLocation, SnakeToSentenceCase<MVHRLocation>> = {
	inside: 'Inside',
	outside: 'Outside'
};

const controlForSupplyAirflowOptions: Record<SupplyAirFlowRateControlType, string> = {
	[SupplyAirFlowRateControlType.ODA]: 'Outdoor air',
	[SupplyAirFlowRateControlType.LOAD]: 'Load'
};

const saveForm = (fields: MechanicalVentilationData) => {
	store.$patch((state) => {
		const { mechanicalVentilation } = state.infiltrationAndVentilation;

		const mechanicalVentilationItem: MechanicalVentilationData = {
			id: uuidv4(),
			name: fields.name,
			typeOfMechanicalVentilationOptions: fields.typeOfMechanicalVentilationOptions,
			controlForSupplyAirflow: fields.controlForSupplyAirflow,
			supplyAirTemperatureControl: fields.supplyAirTemperatureControl,
			airFlowRate: fields.airFlowRate,
			mvhrLocation: fields.mvhrLocation,
			mvhrEfficiency: fields.mvhrEfficiency,
		};

		saveToList(mechanicalVentilationItem, mechanicalVentilation);
		store.infiltrationAndVentilation.mechanicalVentilation.complete = false;
	});

	navigateTo("/infiltration-and-ventilation/mechanical-ventilation");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="mechanicalVentilationErrorSummary" />
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required" />
		<FormKit
			id="typeOfMechanicalVentilationOptions"
			type="govRadios"
			:options="ventTypeOptions"
			label="Type of mechanical ventilation"
			name="typeOfMechanicalVentilationOptions"
			validation="required"
		/>
		<FormKit
			id="controlForSupplyAirflow"
			type="govRadios"
			:options="controlForSupplyAirflowOptions"
			label="Control for the supply airflow"
			name="controlForSupplyAirflow"
			validation="required"
		/>
		<FormKit
			id="supplyAirTemperatureControl" 
			type="govRadios"
			:options="{
				noControl: 'No control',
				constant: 'Constant',
				odaComp: 'Outdoor air compensation',
				loadComp: 'Load compensation'
			}"
			label="Supply air temperature control"
			name="supplyAirTemperatureControl"
			validation="required"
		/>
		<FormKit
			id="airFlowRate"
			type="govInputWithSuffix"
			suffix-text="m3/h"
			label="Air flow rate"
			help="The required design air flow rate to be supplied to or extracted from the ventilation zone by the system"
			name="airFlowRate" validation="required | number | min:0"
		/>
		<template v-if="model.typeOfMechanicalVentilationOptions === VentType.MVHR">
			<h2 class="govuk-heading-l custom-govuk__heading__padding">
				{{ mvhrTitle }}
			</h2>
			<FormKit
				id="mvhrLocation"
				type="govRadios"
				:options="mvhrLocationOptions"
				label="MVHR location"
				help="Whether the MVHR unit is located inside or outside the thermal envelope"
				name="mvhrLocation"
				validation="required"
			/>
			<FormKit
				id="mvhrEfficiency"
				type="govInputFloat"
				label="MVHR efficiency"
				help="Heat recovery efficiency (0 to 1) allowing for in-use factor"
				name="mvhrEfficiency"
				validation="required | min:0 | max:1"
			/>
		</template>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>

<style scoped lang="scss">
@use "sass:map";

.custom-govuk__heading__padding {
	padding-top: 2em;
}
</style>