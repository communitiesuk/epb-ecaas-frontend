<script setup lang="ts">
import { getUrl } from '#imports';
import { WwhrsType } from '~/schema/api-schema.types';
import { isInteger } from "~/utils/validation";

const title = "Waste water heat recovery system";
const store = useEcaasStore();
const { saveToList } = useForm();

const wwhrsData = useItemToEdit('wwhrs', store.domesticHotWater.wwhrs.data);
const model: Ref<WwhrsData> = ref(wwhrsData!);

const { bath, electricShower, mixedShower, otherOutlets } = store.domesticHotWater.hotWaterOutlets;

const hotWaterOutlets = [
	bath.data.map(x => [x.data.id, x.data.name] as [string, string]),
	electricShower.data.map(x => [x.data.id, x.data.name] as [string, string]),
	mixedShower.data.map(x => [x.data.id, x.data.name] as [string, string]),
	otherOutlets.data.map(x => [x.data.id, x.data.name] as [string, string])
].flat();

const wwhrsTypeOptions: Record<WwhrsType, string> = {
	[WwhrsType.WWHRS_InstantaneousSystemA]: 'System A',
	[WwhrsType.WWHRS_InstantaneousSystemB]: 'System B',
	[WwhrsType.WWHRS_InstantaneousSystemC]: 'System C'
};

const saveForm = (fields: WwhrsData) => {
	store.$patch((state) => {
		const {wwhrs} = state.domesticHotWater;

		const item: WwhrsData = {
			name: fields.name,
			outlet: fields.outlet,
			type: fields.type,
			flowRate: fields.flowRate,
			efficiency: fields.efficiency,
			proportionOfUse: fields.proportionOfUse
		};

		saveToList(item, wwhrs);
	});
	store.domesticHotWater.wwhrs.complete = false;
	navigateTo("/domestic-hot-water/wwhrs");
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
		<GovErrorSummary :error-list="errorMessages" test-id="wwhrsErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="outlet"
			type="govRadios"
			:options="new Map(hotWaterOutlets)"
			label="Which outlet is this attached to?"
			help="Select an outlet which has been added previously"
			name="outlet"
			validation="required">
			<div v-if="!hotWaterOutlets.length">
				<p class="govuk-error-message">No outlets added.</p>
				<NuxtLink :to="getUrl('hotWaterOutlets')" class="govuk-link gov-radios-add-link">
					Click here to add an outlet
				</NuxtLink>
			</div>
		</FormKit>
		<FormKit
			id="type"
			type="govRadios"
			:options="wwhrsTypeOptions"
			label="Type"
			name="type"
			validation="required">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<p class="govuk-hint">
					<strong>System A:</strong><br>
					Output of the heat exchanger is fed to both the shower and the combi boiler or hot water system
				</p>
				<p class="govuk-hint">
					<strong>System B:</strong><br>
					Output of the heat exchanger is fed to the shower only
				</p>
				<p class="govuk-hint">
					<strong>System C:</strong><br>
					Output of the heat exchanger is fed to the combi boiler of hot water system but not to the shower
				</p>
			</GovDetails>
		</FormKit>
		<FormKit
			id="flowRate"
			type="govInputWithSuffix"
			label="Flow rate"
			help="The cold water flow rate"
			name="flowRate"
			validation="required | number | between:0.1,500"
			suffix-text="litres per minute"
		/>
		<FormKit
			id="efficiency"
			type="govInputInt"
			label="Efficiency"
			help="The efficiency of the WWHRS. Percentage  (0 to 100)"
			name="efficiency"
			:validation-rules="{ isInteger }"
			validation="required | isInteger | between:0,100"
			:validation-messages="{
				isInteger: `Efficiency must be an integer.`,
			}"
		/>
		<FormKit
			id="proportionOfUse"
			type="govInputFloat"
			label="Proportion of use"
			help="The ratio of time that the WWHRS is in use to the total time that it could be in use. Percentage expressed in decimal form (0 to 1)"
			name="proportionOfUse"
			validation="required | number | between:0,1"
		/>
		<GovLLMWarning />
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>