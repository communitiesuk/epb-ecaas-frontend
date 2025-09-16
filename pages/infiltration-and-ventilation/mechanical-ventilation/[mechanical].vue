<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import type { MVHRLocation } from "~/schema/api-schema.types";
import { VentType } from "~/schema/api-schema.types";
import { litrePerSecond } from "~/utils/units/flowRate";
import { unitValue } from "~/utils/units/types";
import { getUrl } from "#imports";

const title = "Mechanical ventilation";
const store = useEcaasStore();
const { getStoreIndex, autoSaveElementForm } = useForm();

const mechanicalVentilation = useItemToEdit("mechanical", store.infiltrationAndVentilation.mechanicalVentilation.data);
const id = mechanicalVentilation?.data.id ?? uuidv4();

// prepopulate airFlowRate correctly when using old input format
if (typeof mechanicalVentilation?.data.airFlowRate === "number") {
	mechanicalVentilation.data.airFlowRate = unitValue(mechanicalVentilation.data.airFlowRate, litrePerSecond);
}

const model: Ref<MechanicalVentilationData | undefined> = ref(mechanicalVentilation?.data);

/** 'PIV' is excluded from options here because it is in the schema currently but unsupported in HEM itself at 0.34 version */
const ventTypeOptions: Record<Exclude<VentType, "PIV">, string> = {
	[VentType.MVHR]: "MVHR (Mechanical Ventilation with Heat recovery)",
	[VentType.Intermittent_MEV]: "Intermittent MEV (Mechanical Extract Ventilation)",
	[VentType.Centralised_continuous_MEV]: "Centralised continuous MEV (Mechanical Extract Ventilation)",
	[VentType.Decentralised_continuous_MEV]: "Decentralised continuous MEV (Mechanical Extract Ventilation)",
};

const mvhrLocationOptions: Record<MVHRLocation, SnakeToSentenceCase<MVHRLocation>> = {
	inside: "Inside",
	outside: "Outside",
};

const saveForm = (fields: MechanicalVentilationData) => {
	store.$patch((state) => {
		const { mechanicalVentilation } = state.infiltrationAndVentilation;
		const index = getStoreIndex(mechanicalVentilation.data);

		const commonFields = {
			id,
			name: fields.name,
			airFlowRate: fields.airFlowRate,
		};

		let mechanicalVentilationItem: MechanicalVentilationData;

		if (fields.typeOfMechanicalVentilationOptions === VentType.MVHR) {
			mechanicalVentilationItem = {
				...commonFields,
				typeOfMechanicalVentilationOptions: fields.typeOfMechanicalVentilationOptions,
				mvhrLocation: fields.mvhrLocation,
				mvhrEfficiency: fields.mvhrEfficiency,
			};
		} else {
			mechanicalVentilationItem = {
				...commonFields,
				typeOfMechanicalVentilationOptions: fields.typeOfMechanicalVentilationOptions,
			};
		}

		mechanicalVentilation.data[index] = {
			data: mechanicalVentilationItem,
			complete: true,
		};

		mechanicalVentilation.complete = false;
	});

	navigateTo("/infiltration-and-ventilation/mechanical-ventilation");
};

autoSaveElementForm({
	model,
	storeData: store.infiltrationAndVentilation.mechanicalVentilation,
	defaultName: "Mechanical ventilation",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.infiltrationAndVentilation.mechanicalVentilation.data[index] = newData;
		state.infiltrationAndVentilation.mechanicalVentilation.complete = false;
	},
});

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
			id="airFlowRate"
			name="airFlowRate"
			label="Air flow rate"
			help="Enter the required design air flow rate that will be supplied to or extracted from the ventilation zone by the system"
			type="govInputWithUnit"
			:unit="litrePerSecond"
			validation="required"
		>
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr>
							<th scope="col" class="govuk-table__header">Ventilation type</th>
							<th scope="col" class="govuk-table__header">Typical airflow rates</th>
							<th scope="col" class="govuk-table__header">Description</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">MVHR (Mechanical Ventilation with Heat Recovery)</th>
							<td class="govuk-table__cell">42 - 83 l/s</td>
							<td class="govuk-table__cell">Whole-house system. Supplies fresh air and extracts stale air while recovering heat. Exact rate depends on dwelling size.</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Intermittent MEV (Mechanical Extract Ventilation)</th>
							<td class="govuk-table__cell">8 - 17 l/s per fan (typically kitchen/bathroom)</td>
							<td class="govuk-table__cell">Small fans that operate only when needed, for example a humidistat or user control. Each wet room usually has its own fan.</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Centralised Continuous MEV</th>
							<td class="govuk-table__cell">17 - 42 l/s</td>
							<td class="govuk-table__cell">A single unit continuously extracts from multiple rooms via ductwork. Airflow depends on dwelling size and number of wet rooms.</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Decentralised Continuous MEV (dMEV)</th>
							<td class="govuk-table__cell">3 - 11 l/s per fan</td>
							<td class="govuk-table__cell">Individual small fans in each wet room, running continuously at a low rate, with a boost function when needed.</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<template v-if="model?.typeOfMechanicalVentilationOptions === VentType.MVHR">
			<FormKit
				id="mvhrLocation"
				type="govRadios"
				:options="mvhrLocationOptions"
				label="MVHR location"
				help="Select whether the MVHR unit is located inside or outside the thermal envelope"
				name="mvhrLocation"
				validation="required"
			/>
			<FormKit
				id="mvhrEfficiency"
				type="govInputFloat"
				label="MVHR efficiency"
				help="Enter the MVHR's heat recovery efficiency, allowing for in-use factor. The value should be between 0 and 1."
				name="mvhrEfficiency"
				validation="required | min:0 | max:1">
				<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
					<p>The MVHR efficiency is how much heat the system recovers from outgoing air. A typical range is 0.85 to 0.95 for high performance systems.</p>
				</GovDetails>
			</FormKit>
		</template>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('mechanicalVentilation')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>

<style scoped lang="scss">
@use "sass:map";

.custom-govuk__heading__padding {
	padding-top: 2em;
}
</style>