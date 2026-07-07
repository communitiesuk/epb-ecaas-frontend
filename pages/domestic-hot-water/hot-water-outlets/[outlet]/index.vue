<script setup lang="ts">
import { bathSizeZod, otherFlowRateZod, ratedPowerShowerZod, showerFlowRateZod, typeOfShowerProduct, type HotWaterOutletsData } from "~/stores/ecaasStore.schema";
import { coldWaterSourceOptions, getUrl, hotWaterOutletTypes } from "#imports";
import { v4 as uuidv4 } from "uuid";
import { getHotWaterOutletDefaultName } from "~/utils/getHotWaterOutletDefaultName";
import { zodTypeAsFormKitValidation } from "~/utils/zodToFormKitValidation";
import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";

const title = "Hot water outlets";
const store = useEcaasStore();
const route = useRoute();
const { autoSaveElementForm, getStoreIndex } = useForm();
const { mounted } = useMounted();

const hotWaterOutletsStoreData = store.domesticHotWater.hotWaterOutlets.data;
const index = getStoreIndex(hotWaterOutletsStoreData);
const hotWaterOutletData = hotWaterOutletsStoreData[index] as EcaasForm<HotWaterOutletsData>;
const model = ref(hotWaterOutletData?.data);
const id = hotWaterOutletData?.data.id ?? uuidv4();

const productBrandName = ref<string | undefined>();

const saveForm = (fields: HotWaterOutletsData) => {
	store.$patch((state) => {
		const { hotWaterOutlets } = state.domesticHotWater;

		const commonFields = {
			name: fields.name,
			id,
			coldWaterSource: fields.coldWaterSource,
		};

		let hotWaterOutletItem: EcaasForm<HotWaterOutletsData>;

		if (fields.typeOfHotWaterOutlet === "mixedShower") {
			const conditionalOnAirPoweredFields = fields.isAirPressureShower
				? { isAirPressureShower: fields.isAirPressureShower, airPressureShowerProductReference: fields.airPressureShowerProductReference }
				: { isAirPressureShower: false as const , flowRate: fields.flowRate };
			if (fields.wwhrs) {
				hotWaterOutletItem = {
					data: {
						...commonFields,
						typeOfHotWaterOutlet: fields.typeOfHotWaterOutlet,
						wwhrs: true,
						associatedWwhrs: fields.associatedWwhrs,
						...conditionalOnAirPoweredFields,
					},
					complete: true,
				};
			} else {
				hotWaterOutletItem = {
					data: {
						...commonFields,
						typeOfHotWaterOutlet: fields.typeOfHotWaterOutlet,
						wwhrs: false,
						...conditionalOnAirPoweredFields,
					},
					complete: true,
				};
			}
		} else if (fields.typeOfHotWaterOutlet === "electricShower") {
			hotWaterOutletItem = {
				data: {
					...commonFields,
					typeOfHotWaterOutlet: fields.typeOfHotWaterOutlet,
					ratedPower: fields.ratedPower,
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
	navigateTo(getUrl("domesticHotWater"));
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
	() => [model.value?.typeOfHotWaterOutlet, store.domesticHotWater.heatSources.data.length] as const,
	() => {
		const heatSources = store.domesticHotWater.heatSources.data;
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
	storeData: store.domesticHotWater.hotWaterOutlets,
	defaultName: "Hot Water Outlet",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.domesticHotWater.hotWaterOutlets.data[index] = newData;
		state.domesticHotWater.hotWaterOutlets.complete = false;
	},
});

function handleProductLoaded(product: AnyPcdbProduct) {
	if (hasModelDetails(product)) {
		productBrandName.value = product.brandName;
	}
}

// const isProductSelected = () => {
// 	if (hotWaterOutletData.data.typeOfHotWaterOutlet !== "mixedShower"
//         && hotWaterOutletData.data.typeOfHotWaterOutlet !== "electricShower") {
// 		return false;
// 	}
// 	// return hotWaterOutletData?.data.wwhrs.productReference ? true : false;
// };

const heatSourceOptions = new Map(
	store.domesticHotWater.heatSources.data.map((e) => [
		e.data.id,
		e.data.isExistingHeatSource
			? store.spaceHeating.heatSource.data
				.find((x) => x.data.id === e.data.heatSourceId)?.data.name
                ?? "Invalid existing heat source"
			: e.data.name,
	]),
);

const associatedWwhrs = useAssociatedItems(["wwhrs"]);
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovInset>
		<p>Each outlet should be added separately</p>
	</GovInset>
	<GovErrorSummary :error-list="errorMessages" test-id="hotWaterOutletErrorSummary"/>
	<FormKit
		v-if="mounted"
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
			v-if="model?.typeOfHotWaterOutlet"
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<template v-if="mounted && model.typeOfHotWaterOutlet === 'mixedShower'">
			<FormKit
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
				id="coldWaterSource"
				type="govRadios"
				label="Cold water source"
				:options="coldWaterSourceOptions"
				name="coldWaterSource"
				validation="required"
			/>
			<FormKit
				id="isAirPressureShower"
				name="isAirPressureShower"
				type="govBoolean"
				label="Is this an air pressure shower?"
				help="Air pressure showers are products that can be used at a lower flow rate by mixing air into the water stream"
			/>
			<FieldsSelectPcdbProduct
				v-if="model.isAirPressureShower === true"
				id="airPressureShowerProductReference"
				name="airPressureShowerProductReference"
				help="Select the shower type from the PCDB using the button below."
				:selected-product-reference="model.airPressureShowerProductReference"
				:selected-product-type="typeOfShowerProduct.airPressureShower"
				:page-url="route.fullPath"
				:page-index="index"
				@product-loaded="handleProductLoaded"
			/>
		</template>
		<FormKit
			v-if="model.typeOfHotWaterOutlet !== 'mixedShower'"
			id="coldWaterSource"
			type="govRadios"
			label="Cold water source"
			:options="coldWaterSourceOptions"
			name="coldWaterSource"
			validation="required"
		/>
		<FormKit
			v-if="(model.typeOfHotWaterOutlet === 'mixedShower' && model.isAirPressureShower === false) || model.typeOfHotWaterOutlet === 'otherHotWaterOutlet'"
			id="flowRate"
			type="govInputWithSuffix"
			label="Flow rate"
			name="flowRate"
			suffix-text="litres per second"
			:validation="zodTypeAsFormKitValidation(model.typeOfHotWaterOutlet === 'mixedShower' ? showerFlowRateZod : otherFlowRateZod)"
		/>
		<FormKit
			v-if="model.typeOfHotWaterOutlet === 'electricShower'"
			id="ratedPower"
			type="govInputWithSuffix"
			label="Rated power"
			name="ratedPower"
			suffix-text="kW"
			:validation="zodTypeAsFormKitValidation(ratedPowerShowerZod)"
		/>
		<FormKit
			v-if="model.typeOfHotWaterOutlet === 'bath'"
			id="size"
			type="govInputWithSuffix"
			label="Size"
			name="size"
			suffix-text="litres"
			:validation="zodTypeAsFormKitValidation(bathSizeZod)"
			data-field="HotWaterDemand.Bath.*.size"
		/>
		<FormKit
			v-if="model.typeOfHotWaterOutlet === 'mixedShower'"
			id="wwhrs"
			name="wwhrs"
			type="govBoolean"
			label="Is there a waste water heat recovery system for this shower?"
		/>
		<FormKit
			v-if="model.typeOfHotWaterOutlet === 'mixedShower' && model.wwhrs === true"
			id="associatedWwhrs"
			name="associatedWwhrs"
			type="govRadios"
			:options="new Map(associatedWwhrs)"
			label="Waste water heat recovery system"
			validation="required"
		>
			<div v-if="!associatedWwhrs.length">
				<p class="govuk-error-message">No WWHRS added.</p>
				<NuxtLink :to="getUrl('wwhrsCreate')" class="govuk-link gov-radios-add-link">
					Click here to add a WWHRS
				</NuxtLink>
			</div>
		</FormKit>
		<HemDefaultProductWarning :brand-names="[productBrandName]" />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('domesticHotWater')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>