<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { litre, type Volume } from "~/utils/units/volume";
import type { HotWaterCylinderData } from "~/stores/ecaasStore.schema";
import { unitValue } from "~/utils/units";
import { getUrl } from "#imports";

const title = "Water heating";
const store = useEcaasStore();
const { autoSaveForm } = useForm();

const hotWaterCylinderData = store.domesticHotWater.waterHeating.hotWaterCylinder.data[0];

if (typeof hotWaterCylinderData?.data?.storageCylinderVolume === "number") {
	hotWaterCylinderData.data.storageCylinderVolume = unitValue(
		hotWaterCylinderData.data.storageCylinderVolume,
		litre,
	);
}

const waterHeaterTypeOptions = {
	hotWaterCylinder: "Hot water cylinder",
};

type WaterHeaterType = keyof typeof waterHeaterTypeOptions | null;

const model: Ref<Partial<HotWaterCylinderData> & { waterHeaterType: WaterHeaterType[] }> = ref({
	...hotWaterCylinderData?.data,
	waterHeaterType: hotWaterCylinderData ? ["hotWaterCylinder"] : [],
});

// update to autoSaveElementForm if we decide users can add more than 1 hot water cylinder 
autoSaveForm(model, (state, newData) => {
	state.domesticHotWater.waterHeating.hotWaterCylinder.data[0] = {
		data: { ...newData.data,	name: newData.data.name?.trim() || "Hot water cylinder", 
			id: hotWaterCylinderData?.data.id ?? uuidv4() },
	} ;
	state.domesticHotWater.waterHeating.hotWaterCylinder.complete = false;
});

const saveForm = (fields: typeof model.value) => {
	store.$patch({
		domesticHotWater: {
			waterHeating: {
				hotWaterCylinder: {
					data: [{
						data: {
							id: hotWaterCylinderData?.data ? hotWaterCylinderData.data.id : uuidv4(), 
							name: fields.name,
							heatSource: fields.heatSource,
							storageCylinderVolume: fields.storageCylinderVolume,
							dailyEnergyLoss: fields.dailyEnergyLoss,
						},
					}],
					complete: true,
				},
				// the below fields are currently set to empty and marked as complete
				// in future versions they will be supported
				immersionHeater: {
					data: [],
					complete: true,
				},
				solarThermal: {
					data: [],
					complete: true,
				},
				pointOfUse: {
					data: [],
					complete: true,
				},
				heatPump: {
					data: [],
					complete: true,
				},
				combiBoiler: {
					data: [],
					complete: true,
				},
				heatBattery: {
					data: [],
					complete: true,
				},
				smartHotWaterTank: {
					data: [],
					complete: true,
				},
				heatInterfaceUnit: {
					data: [],
					complete: true,
				},
			},
		},
	});

	navigateTo("/domestic-hot-water");
};

const withinMinAndMax = (node: FormKitNode, min: number, max: number) => {
	const value = node.value as Volume;
	return value.amount >= min && value.amount <= max;
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
		<GovErrorSummary :error-list="errorMessages" test-id="waterHeatingErrorSummary"/>
		<FormKit
			id="waterHeaterType"
			type="govCheckboxes"
			name="waterHeaterType"
			label="Water heater type"
			help="For now, this service only allows homes to be modelled with a hot water cylinder. In future releases, there will be further options."
			:options="waterHeaterTypeOptions"
			validation="required"
		/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<ClientOnly>
			<template v-if="model.waterHeaterType?.includes('hotWaterCylinder')">
				<FieldsHeatGenerators
					id="heatSource"
					name="heatSource"
					label="Heat source"
					help="Select the relevant heat source that has been added previously"
				/>
				<FormKit
					id="storageCylinderVolume"
					name="storageCylinderVolume"
					label="Storage cylinder volume"
					help="Enter the total internal capacity of the tank"
					type="govInputWithUnit"
					:unit="litre"
					:validation-rules="{ withinMinAndMax }"
					validation="required | withinMinAndMax:0,200000"
					:validation-messages="{
						withinMinAndMax: `Storage cylinder volume must be at least 0 and no more than 200,000 ${litre.name}.`,
					}"
				/>
				<FormKit
					id="dailyEnergyLoss"
					type="govInputWithSuffix"
					label="Daily energy loss"
					help="Enter the estimated energy lost from the tank per day"
					name="dailyEnergyLoss"
					validation="required | number | min:0 | max:200"
					suffix-text="kWh">
					<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
						<p class="govuk-hint">Daily energy loss encompasses all energy used to heat the water, including the energy to replace heat lost through standing losses and the energy used for hot water draw-offs. Note that this is not standing heat loss, which refers to the heat lost from the cylinder to the surrounding environment over a specific period, typically measured over a 24-hour period.</p>
					</GovDetails>
				</FormKit>
			</template>
		</ClientOnly>
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('domesticHotWater')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>