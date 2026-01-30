<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { getUrl, type DomesticHotWaterHeatSourceData, type HeatSourceData } from "#imports";
import { heatSourceTypesWithDisplay } from "../../../../utils/display";

const title = "Heat source";
const store = useEcaasStore();
const { getStoreIndex } = useForm();
const route = useRoute();

const hotWaterHeatSourceStoreData = store.domesticHotWaterNew.heatSources.data;
const index = getStoreIndex(hotWaterHeatSourceStoreData);
const hotWaterHeatSourceData = useItemToEdit("heatSource", hotWaterHeatSourceStoreData);
const model = ref(hotWaterHeatSourceData?.data as DomesticHotWaterHeatSourceData);
const id = hotWaterHeatSourceData?.data.id ?? uuidv4();

export type HeatPumpModelType = Extract<HeatSourceData, { typeOfHeatSource: "heatPump" }>;
export type BoilerModelType = Extract<HeatSourceData, { typeOfHeatSource: "boiler" }>;
export type HeatNetworkModelType = Extract<HeatSourceData, { typeOfHeatSource: "heatNetwork" }>;
export type HeatBatteryModelType = Extract<HeatSourceData, { typeOfHeatSource: "heatBattery" }>;
export type SolarThermalModelType = Extract<HeatSourceData, { typeOfHeatSource: "solarThermalSystem" }>;

const saveForm = () => {
	store.$patch((state) => {
		state.domesticHotWaterNew.heatSources.data[index]!.complete = true;
		state.domesticHotWaterNew.heatSources.complete = false;
	});

	navigateTo("/domestic-hot-water-new");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();

watch(
	() => model.value,
	(newData, initialData) => {
		if (newData?.isExistingHeatSource !== false) return;

		if (!newData?.typeOfHeatSource) return;

		if (initialData?.isExistingHeatSource !== false) return;

		if (
			initialData.typeOfHeatSource &&
			initialData.typeOfHeatSource !== newData.typeOfHeatSource
		) {
			errorMessages.value = [];
			model.value = { 
				coldWaterSource: initialData.coldWaterSource,
				isExistingHeatSource: false,
				typeOfHeatSource: newData.typeOfHeatSource,
				id: initialData.id,
			} as DomesticHotWaterHeatSourceData;
		}
		if (model.value.isExistingHeatSource === false && model.value && !model.value.name) {
			model.value.name = getHeatSourceDefaultName(model.value);
		}
	},
);

watch(
	() => model.value,
	(newData, _initialData) => {
		// undefined -> "newHeatSource"
		// undefined -> someId
		// "newHeatSource" -> someId
		// someId -> "newHeatSource"
		if (newData.heatSourceId === "NEW_HEAT_SOURCE") {
			model.value.isExistingHeatSource = false;
		} else if (newData.heatSourceId !== undefined) {
			model.value.isExistingHeatSource = true;
		}
	},
);

export interface AutoSaveElementFormOptionsNoName<T> {
	model: Ref<Partial<T> | undefined>;
	storeData: EcaasFormList<T>;
	onPatch: (state: EcaasState, newData: EcaasForm<T>, index: number) => void;
}

const autoSaveElementFormNoName = <T extends DomesticHotWaterHeatSourceData>({
	model,
	storeData,
	onPatch,
}: AutoSaveElementFormOptionsNoName<T>) => {
	watch(model, async (newData: Partial<T> | undefined, initialData: Partial<T> | undefined) => {
		const routeParam = route.params[Object.keys(route.params)[0]!];
		if (initialData === undefined || newData === undefined || routeParam === undefined) {
			return;
		}

		if (newData.isExistingHeatSource === undefined) {
			return;
		}

		if (newData.isExistingHeatSource === false 
			&& (newData as { typeOfHeatSource?: string }).typeOfHeatSource === undefined) {
			return;
		}
		
		if (!hasChangedFields(newData, initialData)) {
			return;
		}
			
		const index = getStoreIndex(storeData.data as EcaasForm<T>[]);
		if (routeParam === "create") {
			// we're about to save, so set the route parameter to the new index
			// we only expect this to trigger on the first change 
			// (after that, routeParam is no longer "create")
			route.params[Object.keys(route.params)[0]!] = index.toString();

			// change the url to reflect this
			const editItemPath = route.fullPath.replace("create", index.toString());
			history.replaceState({}, "", editItemPath);
		}

		store.$patch((state) => {
			const dataToPatch: Partial<T> = { ...newData };

			const elementData: EcaasForm<T> = {
				data: dataToPatch as T,
			};

			onPatch(state, elementData, index);
		});
	});
};

autoSaveElementFormNoName<DomesticHotWaterHeatSourceData>({
	model,
	storeData: store.domesticHotWaterNew.heatSources,
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.domesticHotWaterNew.heatSources.data[index] = newData;
		state.domesticHotWaterNew.heatSources.complete = false;
	},
});


function updateHeatSource(type: string) {
	console.log(type);
	watch(() => model.value[`${type}` as keyof DomesticHotWaterHeatSourceData],
		(newHeatSourceSubtype, initialHeatSourceSubtype) => {
			if (model.value.isExistingHeatSource !== false) {
				throw new Error("Cannot update heat source subtype for existing heat sources");
			}
			if (newHeatSourceSubtype !== initialHeatSourceSubtype) {
				if ("productReference" in model.value) {
					model.value.productReference = "";
				}
				const defaultName = getHeatSourceDefaultName(model.value);
				model.value.name = defaultName;
				(store.domesticHotWaterNew.heatSources.data[index]!.data as { name: string }).name = defaultName;
			}
		},
	);
}

const coldWaterSourceOptions = 
	{ 
		headerTank: "Header tank",
		mainsWater: "Mains water",
	} as const;
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
		<GovErrorSummary :error-list="errorMessages" test-id="heatSourceErrorSummary" />
		<FormKit
			id="coldWaterSource"
			type="govRadios"
			label="Cold water source"
			:options="coldWaterSourceOptions"
			name="coldWaterSource"
			validation="required" />
		<FormKit
			id="heatSourceId"
			type="govRadios"
			label="Use a previously added heat source"
			:help="'To view and edit these options go to Space heating'"
			:options="new Map(store.spaceHeating.heatSource.data
				.filter(x => x.data.id !== undefined)
				.map(x => [x.data.id as string, x.data.name]))
				.set('NEW_HEAT_SOURCE', 'Add a new water heating source')"
			name="heatSourceId"
			validation="required" />
		<FormKit
			v-if="model.isExistingHeatSource === false"
			id="typeOfHeatSource"
			type="govRadios"
			label="Type of heat source"
			:options="heatSourceTypesWithDisplay"
			name="typeOfHeatSource"
			validation="required" />		
		<HeatPumpSection
			v-if="model.isExistingHeatSource === false
				&& model.typeOfHeatSource === 'heatPump'"
			:model="model as HeatPumpModelType"
			:index="index"
			@update-heat-pump-model="updateHeatSource" />
		<BoilerSection
			v-if="model.isExistingHeatSource === false
				&& model.typeOfHeatSource === 'boiler'"
			:model="model as BoilerModelType"
			:index="index"
			@update-boiler-model="updateHeatSource" />
		<HeatNetworkSection
			v-if="model.isExistingHeatSource === false
				&& model.typeOfHeatSource === 'heatNetwork'"
			:model="model as HeatNetworkModelType"
			:index="index"
			@update-heat-network-model="updateHeatSource" />
		<HeatBatterySection
			v-if="model.isExistingHeatSource === false
				&& model.typeOfHeatSource === 'heatBattery'"
			:model="model as HeatBatteryModelType"
			:index="index"
			@update-heat-battery-model="updateHeatSource" />
		<SolarThermalSystemSection
			v-if="model.isExistingHeatSource === false
				&& model.typeOfHeatSource === 'solarThermalSystem'"
			:model="model as SolarThermalModelType" 
			:index="index" />
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('spaceHeating')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>