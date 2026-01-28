<script setup lang="ts">
import type { HotWaterOutletsData, WaterStorageData } from "~/stores/ecaasStore.schema";
import { getUrl } from "~/utils/page";
import { v4 as uuidv4 } from "uuid";

const title = "Hot water outlets";
const store = useEcaasStore();
// const route = useRoute();

// // remove this------------
// store.$patch({
// 	domesticHotWaterNew: {
// 		heatSources: {
// 			data: [
// 				{
// 					data: {
// 						id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
// 						name: "Heat pump 1",
// 					},
// 					complete: true,
// 				},
// 			],
// 		},
// 	},
// });
// //------------------------

const { autoSaveElementForm, getStoreIndex } = useForm();

const hotWaterOutletsStoreData = store.domesticHotWaterNew.hotWaterOutlets.data;
const index = getStoreIndex(hotWaterOutletsStoreData);
const hotWaterOutletData = hotWaterOutletsStoreData[index] as EcaasForm<HotWaterOutletsData>;
const model = ref(hotWaterOutletData?.data);
const id = hotWaterOutletData?.data.id ?? uuidv4();

const saveForm = (fields: HotWaterOutletsData) => {
	store.$patch((state) => {
		const { hotWaterOutlets } = state.domesticHotWaterNew;

		const commonFields = {
			name: fields.name,
			id,

		};

		let hotWaterOutletItem: EcaasForm<HotWaterOutletsData>;

		if (fields.typeOfHotWaterOutlet === "mixedShower") {
			hotWaterOutletItem = {
				data: {
					...commonFields,
					typeOfHotWaterOutlet: fields.typeOfHotWaterOutlet,
					wwhrs: false,//fields.wwhrs,
					flowRate: fields.flowRate,
					hotWaterSource: fields.hotWaterSource,
				},
				complete: true,
			};
		} else if (fields.typeOfHotWaterOutlet === "electricShower") {
			hotWaterOutletItem = {
				data: {
					...commonFields,
					typeOfHotWaterOutlet: fields.typeOfHotWaterOutlet,
					ratedPower: fields.ratedPower,
					wwhrs: false,//fields.wwhrs,
				},
				complete: true,
			};
		} else if (fields.typeOfHotWaterOutlet === "bath") {
			hotWaterOutletItem = {
				data: {
					...commonFields,
					typeOfHotWaterOutlet: fields.typeOfHotWaterOutlet,
					size: fields.size,
				},
				complete: true,
			};
		} else if (fields.typeOfHotWaterOutlet === "otherHotWaterOutlet") {
			hotWaterOutletItem = {
				data: {
					...commonFields,
					typeOfHotWaterOutlet: fields.typeOfHotWaterOutlet,
					flowRate: fields.flowRate,
				},
				complete: true,
			};
		} else {
			throw new Error("Invalid hot water outlet type");
		}

		hotWaterOutlets.data[index] = hotWaterOutletItem;
		hotWaterOutlets.complete = false;
	});
	navigateTo("/domestic-hot-water-new");
};
			
const { handleInvalidSubmit, errorMessages } = useErrorSummary();

autoSaveElementForm<WaterStorageData>({
	model,
	storeData: store.domesticHotWaterNew.waterStorage,
	defaultName: "Water storage",
	onPatch: (state, newData, index) => {
		state.domesticHotWaterNew.waterStorage.data[index] = newData;
		state.domesticHotWaterNew.waterStorage.complete = false;
	},
});

// const isProductSelected = () => {
// 	if (hotWaterOutletData.data.typeOfHotWaterOutlet !== "mixedShower" 
//         && hotWaterOutletData.data.typeOfHotWaterOutlet !== "electricShower") {
// 		return false;
// 	}
// 	// return hotWaterOutletData?.data.wwhrs.productReference ? true : false;
// };

const hotWaterOutlets = [
	["mixedShower", "Mixer shower"],
	["electricShower", "Electric shower"],
	["bath", "Bath"],
	["otherHotWaterOutlet", "Other (basin tap, kitchen sink, etc.)"],
] as [string, string][];

const hotWaterSourceOptions = new Map(
	store.domesticHotWaterNew.heatSources.data
		.map((e) => {
			const existingHeatSourceName = getNameFromSpaceHeatingHeatSource(e.data.heatSourceId);
			return [
				e.data.id,
				e.data.isExistingHeatSource 
					? existingHeatSourceName !== undefined
						? existingHeatSourceName
						: "Invalid existing heat source" // should not happen if space heating heat sources delete the hot water reference ones when removed but yknow I could be wrong
					: e.data.name,
			];
		}),
);

function getNameFromSpaceHeatingHeatSource(heatSourceId: string) {
	const heatSource = store.spaceHeating.heatSource.data
		.find((x) => x.data.id === heatSourceId);
	return heatSource ? heatSource.data.name : undefined;
}

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
		<GovErrorSummary :error-list="errorMessages" test-id="hotWaterOutletErrorSummary"/>
		<FormKit
			id="typeOfHotWaterOutlet"
			name="typeOfHotWaterOutlet"
			type="govRadios"
			:options="new Map(hotWaterOutlets)"
			label="Type of hot water outlet"
			validation="required"
		/>
		<FormKit
			v-if="model.typeOfHotWaterOutlet"
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			v-if="model.typeOfHotWaterOutlet === 'mixedShower'"	
			id="hotWaterSource"
			name="hotWaterSource"
			type="govRadios"
			label="Hot water source"
			help="Select the relevant hot water source that has been added previously"
			validation="required"
			:options="hotWaterSourceOptions"
		/>
		<FormKit
			v-if="model.typeOfHotWaterOutlet === 'mixedShower' || model.typeOfHotWaterOutlet === 'otherHotWaterOutlet'"	
			id="flowRate"
			type="govInputWithSuffix"
			label="Flow rate"
			name="flowRate"
			suffix-text="litres per second"
			validation="required|number|min:8|max:15"
		/>
		<FormKit
			v-if="model.typeOfHotWaterOutlet === 'electricShower'"	
			id="ratedPower"
			type="govInputWithSuffix"
			label="Rated power"
			name="ratedPower"
			suffix-text="kW"
			validation="required|number|min:0|max:30"
		/>
		<FormKit
			v-if="model.typeOfHotWaterOutlet === 'bath'"	
			id="size"
			type="govInputWithSuffix"
			label="Size"
			name="size"
			suffix-text="litres"
			validation="required|number|min:0|max:500"
			data-field="HotWaterDemand.Bath.*.size"
		/>
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('domesticHotWaterNew')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>