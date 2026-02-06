<script setup lang="ts">
import type { HotWaterOutletsData } from "~/stores/ecaasStore.schema";
import { getUrl, hotWaterOutletTypes, wwhrsTypes } from "#imports";
import { v4 as uuidv4 } from "uuid";
import { getHotWaterOutletDefaultName } from "~/utils/getHotWaterOutletDefaultName";

const title = "Hot water outlets";
const store = useEcaasStore();
const route = useRoute();

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
			if (fields.wwhrs) {
				hotWaterOutletItem = {
					data: {
						...commonFields,
						typeOfHotWaterOutlet: fields.typeOfHotWaterOutlet,
						flowRate: fields.flowRate,
						dhwHeatSourceId: fields.dhwHeatSourceId,
						wwhrs: true,
						wwhrsType: fields.wwhrsType,
						wwhrsProductReference: fields.wwhrsProductReference,
					},
					complete: true,
				};
			} else {
				hotWaterOutletItem = {
					data: {
						...commonFields,
						typeOfHotWaterOutlet: fields.typeOfHotWaterOutlet,
						flowRate: fields.flowRate,
						dhwHeatSourceId: fields.dhwHeatSourceId,
						wwhrs: false,
					},
					complete: true,
				};
			}
		} else if (fields.typeOfHotWaterOutlet === "electricShower") {
			if (fields.wwhrs) {
				hotWaterOutletItem = {
					data: {
						...commonFields,
						typeOfHotWaterOutlet: fields.typeOfHotWaterOutlet,
						ratedPower: fields.ratedPower,
						wwhrs: true,
						wwhrsType: fields.wwhrsType,
						wwhrsProductReference: fields.wwhrsProductReference,
					},
					complete: true,
				};
			} else {
				hotWaterOutletItem = {
					data: {
						...commonFields,
						typeOfHotWaterOutlet: fields.typeOfHotWaterOutlet,
						ratedPower: fields.ratedPower,
						wwhrs: false,
					},
					complete: true,
				};
			}
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

watch(
	() => model.value?.typeOfHotWaterOutlet,
	(newType, oldType) => {
		if (newType && oldType !== newType) {
			errorMessages.value = [];
			const preservedId = model.value?.id;
			const defaultName = getHotWaterOutletDefaultName(newType);
			model.value = { 
				typeOfHotWaterOutlet: newType, 
				id: preservedId,
				...(defaultName && { name: defaultName }),
			} as HotWaterOutletsData;
		}
	},
);

watch(
	() => [model.value?.typeOfHotWaterOutlet, store.domesticHotWaterNew.heatSources.data.length] as const,
	() => {
		const heatSources = store.domesticHotWaterNew.heatSources.data;
		if (heatSources.length === 1 && model.value && model.value.typeOfHotWaterOutlet === "mixedShower") {
			const heatSourceId = heatSources[0]?.data.id;
			if ("dhwHeatSourceId" in model.value && heatSourceId) {
				model.value.dhwHeatSourceId = heatSourceId;
			}
		}
	},
);

autoSaveElementForm<HotWaterOutletsData>({
	model,
	storeData: store.domesticHotWaterNew.hotWaterOutlets,
	defaultName: "Water storage",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.domesticHotWaterNew.hotWaterOutlets.data[index] = newData;
		state.domesticHotWaterNew.hotWaterOutlets.complete = false;
	},
});

// const isProductSelected = () => {
// 	if (hotWaterOutletData.data.typeOfHotWaterOutlet !== "mixedShower" 
//         && hotWaterOutletData.data.typeOfHotWaterOutlet !== "electricShower") {
// 		return false;
// 	}
// 	// return hotWaterOutletData?.data.wwhrs.productReference ? true : false;
// };

const heatSourceOptions = new Map(
	store.domesticHotWaterNew.heatSources.data.map((e) => [
		e.data.id,
		e.data.isExistingHeatSource
			? store.spaceHeating.heatSource.data
				.find((x) => x.data.id === e.data.heatSourceId)?.data.name
                ?? "Invalid existing heat source"
			: e.data.name,
	]),
);

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovErrorSummary :error-list="errorMessages" test-id="hotWaterOutletErrorSummary"/>
	<FormKit
		v-model="model"
		type="form"
		validation-visibility="submit"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<FormKit
			id="typeOfHotWaterOutlet"
			name="typeOfHotWaterOutlet"
			type="govRadios"
			:options="hotWaterOutletTypes"
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
			id="dhwHeatSourceId"
			name="dhwHeatSourceId"
			type="govRadios"
			label="Hot water source"
			help="Select the relevant hot water source that has been added previously"
			validation="required"
			:options="heatSourceOptions"
		>			
			<div
				v-if="!heatSourceOptions.size"
				data-testid="noHeatSource"
			>
				<p class="govuk-error-message">No heat sources added.</p>
				<NuxtLink :to="getUrl('heatSourcesCreate')" class="govuk-link gov-radios-add-link">
					Click here to add a heat source
				</NuxtLink>
			</div>
		</FormKit>
	
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
		<FormKit
			v-if="model.typeOfHotWaterOutlet === 'mixedShower' || model.typeOfHotWaterOutlet === 'electricShower'"
			id="wwhrs"
			name="wwhrs"
			type="govBoolean"
			label="Is there a waste water heat recovery system for this shower?"
		/>
		<FormKit
			v-if="(model.typeOfHotWaterOutlet === 'mixedShower' || model.typeOfHotWaterOutlet === 'electricShower') && model.wwhrs === true"
			id="wwhrsType"
			name="wwhrsType"
			type="govRadios"
			:options="wwhrsTypes"
			label="Type of waste water heat recovery system"
			validation="required"
		/>
		<FormKit
			v-if="(model.typeOfHotWaterOutlet === 'mixedShower' || model.typeOfHotWaterOutlet === 'electricShower') && model.wwhrs === true"
			id="selectWwhrsProduct"
			type="govPcdbProduct"
			label="Select a product"
			name="wwhrsProductReference"
			help="Select the WWHRS type from the PCDB using the button below."
			:selected-product-reference="model.wwhrsProductReference"
			:selected-product-type="model.typeOfHotWaterOutlet"
			:page-url="route.fullPath"
			:page-index="index"
		/>
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('domesticHotWaterNew')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>