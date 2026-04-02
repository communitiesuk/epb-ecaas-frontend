<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import type { MVHRLocation, VentType } from "~/schema/aliases";
import { litrePerSecond } from "~/utils/units/flowRate";
import { unitValue } from "~/utils/units";
import { getUrl, typeOfMechanicalVentilation, uniqueName, type MechanicalVentilationData } from "#imports";
import Orientation from "~/components/fields/Orientation.vue";
import Pitch from "~/components/fields/Pitch.vue";
import { useAssociatedItems } from "~/composables/associatedItems";
import { installationTypeOptions, installationLocationOptions } from "~/utils/display";

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

const associatedItemOptions = useAssociatedItems(["wall", "roof", "window"]);

const saveForm = async (fields: MechanicalVentilationData) => {
	fields.hasAssociatedItem = !!fields.associatedItemId && fields.associatedItemId !== "none";

	store.$patch((state) => {
		const { mechanicalVentilation } = state.infiltrationAndVentilation;

		const commonFields = {
			id,
			name: fields.name,
			airFlowRate: fields.airFlowRate,
		};

		let mechanicalVentilationItem: MechanicalVentilationData;

		switch (fields.typeOfMechanicalVentilationOptions) {
			case "Centralised continuous MEV":
				mechanicalVentilationItem = {
					...commonFields,
					typeOfMechanicalVentilationOptions: "Centralised continuous MEV",
					productReference: fields.productReference,
					midHeightOfAirFlowPath: fields.midHeightOfAirFlowPath,
					installedUnderApprovedScheme: fields.installedUnderApprovedScheme,
					associatedItemId: fields.associatedItemId,
					...(fields.hasAssociatedItem ? {
						hasAssociatedItem: fields.hasAssociatedItem,
					} : {
						hasAssociatedItem: false,
						pitch: fields.pitch,
						orientation: fields.orientation,
					}),
					...(fields.measuredFanPowerAndAirFlowRateKnown ? {
						measuredFanPowerAndAirFlowRateKnown: true,
						measuredAirFlowRate: fields.measuredAirFlowRate,
						measuredFanPower: fields.measuredFanPower,
					} : {
						measuredFanPowerAndAirFlowRateKnown: false,
					}),
				};
				break;

			case "Decentralised continuous MEV":
				mechanicalVentilationItem = {
					...commonFields,
					typeOfMechanicalVentilationOptions: "Decentralised continuous MEV",
					productReference: fields.productReference,
					installationType: fields.installationType,
					installationLocation: fields.installationLocation,
					installedUnderApprovedScheme: fields.installedUnderApprovedScheme,
					midHeightOfAirFlowPath: fields.midHeightOfAirFlowPath,
					associatedItemId: fields.associatedItemId,
					...(fields.hasAssociatedItem ? {
						hasAssociatedItem: fields.hasAssociatedItem,
					} : {
						hasAssociatedItem: false,
						pitch: fields.pitch,
						orientation: fields.orientation,
					}),
				};
				break;

			case "Intermittent MEV":
				mechanicalVentilationItem = {
					...commonFields,
					typeOfMechanicalVentilationOptions: fields.typeOfMechanicalVentilationOptions,
					specificFanPower: fields.specificFanPower,
					midHeightOfAirFlowPath: fields.midHeightOfAirFlowPath,
					associatedItemId: fields.associatedItemId,
					...(fields.hasAssociatedItem ? {
						hasAssociatedItem: fields.hasAssociatedItem,
					} : {
						hasAssociatedItem: false,
						pitch: fields.pitch,
						orientation: fields.orientation,
					}),
				};
				break;
		
			default:
				mechanicalVentilationItem = {
					...commonFields,
					typeOfMechanicalVentilationOptions: "MVHR",
					productReference: fields.productReference,
					mvhrLocation: fields.mvhrLocation,
					midHeightOfAirFlowPathForIntake: fields.midHeightOfAirFlowPathForIntake,
					orientationOfIntake: fields.orientationOfIntake,
					pitchOfIntake: fields.pitchOfIntake,
					midHeightOfAirFlowPathForExhaust: fields.midHeightOfAirFlowPathForExhaust,
					orientationOfExhaust: fields.orientationOfExhaust,
					pitchOfExhaust: fields.pitchOfExhaust,
					installedUnderApprovedScheme: fields.installedUnderApprovedScheme,
					associatedItemId: fields.associatedItemId,
					...(fields.hasAssociatedItem ? {
						hasAssociatedItem: fields.hasAssociatedItem,
					} : {
						hasAssociatedItem: false,
						pitch: fields.pitch,
						orientation: fields.orientation,
					}),
					...(fields.measuredFanPowerAndAirFlowRateKnown ? {
						measuredFanPowerAndAirFlowRateKnown: true,
						measuredAirFlowRate: fields.measuredAirFlowRate,
						measuredFanPower: fields.measuredFanPower,
					} : {
						measuredFanPowerAndAirFlowRateKnown: false,
					}),
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
			label="Select a product"
			name="productReference"
			validation="required"
			help="Select the mechanical vent type from the PCDB using the button below"
			:selected-product-reference="'productReference' in model ? model.productReference : null"
			:selected-product-type="typeOfMechanicalVentilation.mvhr"
			:page-url="route.fullPath"
			:page-index="index"
		/>
		<FormKit
			v-if="model?.typeOfMechanicalVentilationOptions === 'Centralised continuous MEV'"
			id="selectCentralisedContinuousMev"
			type="govPcdbProduct"
			label="Select a product"
			name="productReference"
			validation="required"
			help="Select the mechanical vent type from the PCDB using the button below"
			:selected-product-reference="'productReference' in model ? model.productReference : null"
			:selected-product-type="typeOfMechanicalVentilation.centralisedContinuousMev"
			:page-url="route.fullPath"
			:page-index="index"
		/>
		<FormKit
			v-if="model?.typeOfMechanicalVentilationOptions === 'Decentralised continuous MEV'"
			id="selectDecentralisedContinuousMev"
			type="govPcdbProduct"
			label="Select a product"
			name="productReference"
			validation="required"
			help="Select the mechanical vent type from the PCDB using the button below"
			:selected-product-reference="'productReference' in model ? model.productReference : null"
			:selected-product-type="typeOfMechanicalVentilation.decentralisedContinuousMev"
			:page-url="route.fullPath"
			:page-index="index"
		/>
		<template v-if="model?.typeOfMechanicalVentilationOptions === 'MVHR' || model?.typeOfMechanicalVentilationOptions === 'Centralised continuous MEV'">
			<FormKit
				id="measuredFanPowerAndAirFlowRateKnown"
				type="govBoolean"
				label="Do you know the measured fan power and air flow rate?"
				name="measuredFanPowerAndAirFlowRateKnown"
				validation="required"
			/>
			<template v-if="('measuredFanPowerAndAirFlowRateKnown' in model && model.measuredFanPowerAndAirFlowRateKnown)">
				<FormKit
					id="measuredFanPower"
					type="govInputWithSuffix"
					label="Measured fan power"
					suffix-text="W"
					name="measuredFanPower"
					validation="required | number"
				/>
				<FormKit
					id="measuredAirFlowRate"
					type="govInputWithSuffix"
					label="Measured air flow rate"
					suffix-text="litres per second"
					name="measuredAirFlowRate"
					validation="required | number"
				/>
			</template>
		</template>
		<template v-if="model?.typeOfMechanicalVentilationOptions === 'Intermittent MEV'">
			<FormKit
				id="specificFanPower"
				type="govInputWithSuffix"
				label="Specific fan power"
				suffix-text="W/(l/s)"
				name="specificFanPower"
				validation="required | number"
			/>
		</template>
		<FormKit
			id="airFlowRate"
			name="airFlowRate"
			label="Design air flow rate"
			help="Enter the required design air flow rate that will be supplied to or extracted from the ventilation zone by the system. Typically between 10 and 50 l/s."
			type="govInputWithUnit"
			:unit="litrePerSecond"
			validation="required"
			data-field="InfiltrationVentilation.MechanicalVentilation.design_outdoor_air_flow_rate"
		/>
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
			<ClientOnly>
				<FormKit
					v-if="associatedItemOptions.length"
					id="associatedItemId"
					type="govRadios"
					:options="new Map(associatedItemOptions)"
					label="Associated wall, roof or window"
					help="Select the wall, roof or window that this vent is in. It should have the same orientation and pitch as the vent."
					name="associatedItemId"
					validation="required"
				/>
			</ClientOnly>
			<template v-if="associatedItemOptions.length <= 1 || (model && 'associatedItemId' in model && model.associatedItemId === 'none')">
				<FieldsPitch label="Pitch of vent" help="Enter the tilt angle of the external surface of the vent. 0° means the external surface is facing up like ceilings, and 180° means the external surface is facing down like floors." />
				<FieldsOrientation label="Orientation of vent" help="Enter the orientation of the vent's external surface" />
			</template>
			<FormKit
				id="installedUnderApprovedScheme"
				type="govBoolean"
				label="Is the vent installed under an approved installation scheme?"
				name="installedUnderApprovedScheme"
				validation="required"
			/>
			<FormKit
				id="midHeightOfAirFlowPathForIntake"
				type="govInputFloat"
				label="Mid-height of air flow path for intake"
				help="Enter the mid-height of the path through which the air flows in the intake, measured from the bottom of the ventilation zone to the middle of the intake."
				name="midHeightOfAirFlowPathForIntake"
				validation="required | min:0"
				data-field="InfiltrationVentilation.MechanicalVentilation.mid_height_of_air_flow_path_for_intake">
				<FieldsMidHeightOfAirflowPathGuidance />
			</FormKit>
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
				help="Enter the mid-height of the path through which the air flows in the exhaust, measured from the bottom of the ventilation zone to the middle of the exhaust."
				name="midHeightOfAirFlowPathForExhaust"
				validation="required | min:0"
				data-field="InfiltrationVentilation.MechanicalVentilation.mid_height_of_air_flow_path_for_exhaust">
				<FieldsMidHeightOfAirflowPathGuidance />
			</FormKit>
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
		<template v-if="model?.typeOfMechanicalVentilationOptions === 'Decentralised continuous MEV'">
			<FormKit
				id="installationType"
				type="govRadios"
				:options="installationTypeOptions"
				label="Where is the vent installed?"
				name="installationType"
				validation="required"
			/>
			<FormKit
				id="installationLocation"
				type="govRadios"
				:options="installationLocationOptions"
				label="Room where the vent is installed"
				name="installationLocation"
				validation="required"
			/>
		</template>
		<template v-if="model?.typeOfMechanicalVentilationOptions !== 'MVHR'">
			<ClientOnly>
				<FormKit
					v-if="associatedItemOptions.length > 1"
					id="associatedItemId"
					type="govRadios"
					:options="new Map(associatedItemOptions)"
					label="Associated wall, roof or window"
					help="Select the wall, roof or window that this vent is in. It should have the same orientation and pitch as the vent."
					name="associatedItemId"
					validation="required"
				/>
			</ClientOnly>
			<template v-if="associatedItemOptions.length <= 1 || (model && 'associatedItemId' in model && model.associatedItemId === 'none')">
				<FieldsPitch label="Pitch of vent" help="Enter the tilt angle of the external surface of the vent. 0° means the external surface is facing up like ceilings, and 180° means the external surface is facing down like floors." />
				<FieldsOrientation label="Orientation of vent" help="Enter the orientation of the vent's external surface" />
			</template>
			<FormKit
				id="midHeightOfAirFlowPath"
				type="govInputWithSuffix"
				label="Mid-height of airflow path"
				help="Enter the height from the ventilation zone base height to the midpoint where the air flows through the vent"
				suffix-text="m"
				name="midHeightOfAirFlowPath"
				validation="required | number"
			/>
		</template>
		<template v-if="model?.typeOfMechanicalVentilationOptions === 'Centralised continuous MEV' || model?.typeOfMechanicalVentilationOptions === 'Decentralised continuous MEV'">
			<FormKit
				id="installedUnderApprovedScheme"
				type="govBoolean"
				label="Is the vent installed under an approved installation scheme?"
				name="installedUnderApprovedScheme"
				validation="required"
			/>
		</template>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('mechanicalVentilation')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
