<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import type { MVHRLocation, VentType } from "~/schema/aliases";
import { litrePerSecond } from "~/utils/units/flowRate";
import { unitValue } from "~/utils/units";
import { getUrl, typeOfMechanicalVentilation, uniqueName, type MechanicalVentilationData } from "#imports";
import Orientation from "~/components/fields/Orientation.vue";
import Pitch from "~/components/fields/Pitch.vue";

const title = "Mechanical ventilation";
const store = useEcaasStore();
const route = useRoute();
const { getStoreIndex, autoSaveElementForm } = useForm();

const mechanicalVentilationStoreData = store.infiltrationAndVentilation.mechanicalVentilation.data;
const index = getStoreIndex(mechanicalVentilationStoreData);
const mechanicalVentilation = useItemToEdit("mechanical", mechanicalVentilationStoreData);
const id = mechanicalVentilation?.data.id ?? uuidv4();

// prepopulate airFlowRate correctly when using old input format
if (typeof mechanicalVentilation?.data.airFlowRate === "number") {
	mechanicalVentilation.data.airFlowRate = unitValue(mechanicalVentilation.data.airFlowRate, litrePerSecond);
}

const model = ref(mechanicalVentilation?.data);

const ventTypeOptions: Record<VentType, string> = {
	MVHR: "MVHR (Mechanical Ventilation with Heat recovery)",
	["Intermittent MEV"]: "Intermittent MEV (Mechanical Extract Ventilation)",
	["Centralised continuous MEV"]: "Centralised continuous MEV (Mechanical Extract Ventilation)",
	["Decentralised continuous MEV"]: "Decentralised continuous MEV (Mechanical Extract Ventilation)",
};

const mvhrLocationOptions: Record<MVHRLocation, SnakeToSentenceCase<MVHRLocation>> = {
	inside: "Inside",
	outside: "Outside",
};

const saveForm = (fields: MechanicalVentilationData) => {
	store.$patch((state) => {
		const { mechanicalVentilation } = state.infiltrationAndVentilation;

		const commonFields = {
			id,
			name: fields.name,
			airFlowRate: fields.airFlowRate,
			productReference: fields.productReference,
		};

		let mechanicalVentilationItem: MechanicalVentilationData;

		if (fields.typeOfMechanicalVentilationOptions === "MVHR") {
			mechanicalVentilationItem = {
				...commonFields,
				typeOfMechanicalVentilationOptions: "MVHR",
				mvhrLocation: fields.mvhrLocation,
				mvhrEfficiency: fields.mvhrEfficiency,
				midHeightOfAirFlowPathForIntake: fields.midHeightOfAirFlowPathForIntake,
				orientationOfIntake: fields.orientationOfIntake,
				pitchOfIntake: fields.pitchOfIntake,
				midHeightOfAirFlowPathForExhaust: fields.midHeightOfAirFlowPathForExhaust,
				orientationOfExhaust: fields.orientationOfExhaust,
				pitchOfExhaust: fields.pitchOfExhaust,
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

autoSaveElementForm<MechanicalVentilationData>({
	model,
	storeData: store.infiltrationAndVentilation.mechanicalVentilation,
	defaultName: "Mechanical ventilation",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.infiltrationAndVentilation.mechanicalVentilation.data[index] = newData;
		state.infiltrationAndVentilation.mechanicalVentilation.complete = false;
	},
});

function updateMechanicalVentilation(type: keyof MechanicalVentilationData) {
	watch(() => model.value?.[type], (newMechanicalVentilationType, initialNechanicalVentilationType) => {
		if (model.value &&
			newMechanicalVentilationType !==
			initialNechanicalVentilationType && "productReference" in model.value
		) {
			model.value.productReference = "";
		}
	});
}

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
			:validation-rules="{ uniqueName: uniqueName(mechanicalVentilationStoreData, { id }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FormKit
			id="typeOfMechanicalVentilationOptions"
			type="govRadios"
			:options="ventTypeOptions"
			label="Type of mechanical ventilation"
			name="typeOfMechanicalVentilationOptions"
			validation="required"
			data-field="InfiltrationVentilation.MechanicalVentilation.vent_type"
			@click="() => updateMechanicalVentilation('typeOfMechanicalVentilationOptions')"
		/>
		<FormKit
			v-if="model?.typeOfMechanicalVentilationOptions === 'MVHR'"
			id="selectMvhr"
			type="govPcdbProduct"
			label="Select an MVHR"
			name="productReference"
			validation="required"
			help="Select the MVHR model from the PCDB using the button below."
			:selected-product-reference="model?.productReference"
			:selected-product-type="typeOfMechanicalVentilation.mvhr"
			:page-url="route.fullPath"
			:page-index="index"
		/>
		<FormKit
			v-if="model?.typeOfMechanicalVentilationOptions === 'Centralised continuous MEV'"
			id="selectCentralisedContinuousMev"
			type="govPcdbProduct"
			label="Select a centralised continuous MEV"
			name="productReference"
			validation="required"
			help="Select the cenralised continuous MEV model from the PCDB using the button below."
			:selected-product-reference="model?.productReference"
			:selected-product-type="typeOfMechanicalVentilation.centralisedContinuousMev"
			:page-url="route.fullPath"
			:page-index="index"
		/>
		<FormKit
			v-if="model?.typeOfMechanicalVentilationOptions === 'Decentralised continuous MEV'"
			id="selectDecentralisedContinuousMev"
			type="govPcdbProduct"
			label="Select a decentralised continuous MEV"
			name="productReference"
			validation="required"
			help="Select the decenralised continuous MEV model from the PCDB using the button below."
			:selected-product-reference="model?.productReference"
			:selected-product-type="typeOfMechanicalVentilation.decentralisedContinuousMev"
			:page-url="route.fullPath"
			:page-index="index"
		/>
		<FormKit
			id="airFlowRate"
			name="airFlowRate"
			label="Air flow rate"
			help="Enter the required design air flow rate that will be supplied to or extracted from the ventilation zone by the system"
			type="govInputWithUnit"
			:unit="litrePerSecond"
			validation="required"
			data-field="InfiltrationVentilation.MechanicalVentilation.design_outdoor_air_flow_rate"
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
		<template v-if="model?.typeOfMechanicalVentilationOptions === 'MVHR'">
			<FormKit
				id="mvhrLocation"
				type="govRadios"
				:options="mvhrLocationOptions"
				label="MVHR location"
				help="Select whether the MVHR unit is located inside or outside the thermal envelope"
				name="mvhrLocation"
				validation="required"
				data-field="InfiltrationVentilation.MechanicalVentilation.mvhr_location"
			/>
			<FormKit
				id="mvhrEfficiency"
				type="govInputFloat"
				label="MVHR efficiency"
				help="Enter the MVHR's heat recovery efficiency, allowing for in-use factor. The value should be between 0 and 1."
				name="mvhrEfficiency"
				validation="required | min:0 | max:1"
				data-field="InfiltrationVentilation.MechanicalVentilation.mvhr_efficiency">
				<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
					<p>The MVHR efficiency is how much heat the system recovers from outgoing air. A typical range is 0.85 to 0.95 for high performance systems.</p>
				</GovDetails>
			</FormKit>
			<FormKit
				id="midHeightOfAirFlowPathForIntake"
				type="govInputFloat"
				label="Mid-height of air flow path for intake"
				help="Enter the mid-height of the path through which the air flows in the intake, measured from ground level to the mid point of the intake."
				name="midHeightOfAirFlowPathForIntake"
				validation="required | min:0"
				data-field="InfiltrationVentilation.MechanicalVentilation.mid_height_of_air_flow_path_for_intake"
			/>
			<Orientation
				id="orientationOfIntake"
				name="orientationOfIntake"
				label="Orientation of intake"
				help="Enter the orientation of the vent which takes in the air"
				data-field="InfiltrationVentilation.MechanicalVentilation.orientation_of_intake"
			/>
			<Pitch
				id="pitchOfIntake"
				name="pitchOfIntake"
				label="Pitch of intake"
				help="Enter the pitch of the vent which takes in the air. 0° meant the external surface is facing up like ceilings, and 180° means the external surface is facing down like floors."
				data-field="InfiltrationVentilation.MechanicalVentilation.pitch_of_intake"
			/>
			<FormKit
				id="midHeightOfAirFlowPathForExhaust"
				type="govInputFloat"
				label="Mid-height of air flow path for exhaust"
				help="Enter the mid-height of the path through which the air flows in the exhaust, measured from ground level to the mid point of the exhaust."
				name="midHeightOfAirFlowPathForExhaust"
				validation="required | min:0"
				data-field="InfiltrationVentilation.MechanicalVentilation.mid_height_of_air_flow_path_for_exhaust"
			/>
			<Orientation
				id="orientationOfExhaust"
				name="orientationOfExhaust"
				label="Orientation of exhaust"
				help="Enter the orientation of the exhaust vent"
				data-field="InfiltrationVentilation.MechanicalVentilation.orientation_of_exhaust"
			/>
			<Pitch
				id="pitchOfExhaust"
				name="pitchOfExhaust"
				label="Pitch of exhaust"
				help="Enter the pitch of the exhaust vent. 0° means the external surface is facing up like ceilings, and 180° means the external surface is facing down like floors."
				data-field="InfiltrationVentilation.MechanicalVentilation.pitch_of_exhaust"
			/>
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