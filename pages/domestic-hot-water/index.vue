<script setup lang="ts">
import { hasPackagedProduct, isEcaasForm } from "#imports";
import type { CustomListItem } from "~/components/CustomList.vue";
import type { ConflictMessage } from "~/common.types";
import { useDomesticHotWater } from "~/composables/domesticHotWater";
import formStatus from "~/constants/formStatus";
import type { DomesticHotWaterHeatSourceData, EcaasForm, HeatSourceData, PreheatedWaterStorageData, WaterStorageData } from "~/stores/ecaasStore.schema";

const title = "Domestic hot water";

const page = usePage();
const store = useEcaasStore();
const { removeEntry, duplicateEntry } = useDomesticHotWater();
const { getActualHeatSource } = useHeatSources();

const { heatSources: dhwHeatSources, preheatedWaterStorage } = store.domesticHotWater;

const { errorMessages, addError, clearErrors } = useErrorSummary();

function getDhwHeatSourceType(heatSourceForm: EcaasForm<DomesticHotWaterHeatSourceData>): Extract<DomesticHotWaterHeatSourceData, { typeOfHeatSource: string }>["typeOfHeatSource"] | undefined {
	if (heatSourceForm.data.isExistingHeatSource) {
		return store.spaceHeating.heatSource.data.find(
			x => x.data.id === heatSourceForm.data.heatSourceId,
		)?.data.typeOfHeatSource;
	}

	return heatSourceForm.data.typeOfHeatSource;
}

function isHeatPumpConnectedToExistingHeatNetwork(
	heatSourceForm: EcaasForm<DomesticHotWaterHeatSourceData>,
): boolean {
	if (heatSourceForm.data.isExistingHeatSource) {
		const existingHeatSource = store.spaceHeating.heatSource.data.find(
			x => x.data.id === heatSourceForm.data.heatSourceId,
		)?.data;

		if (
			existingHeatSource?.typeOfHeatSource === "heatPump" &&
			"associatedHeatNetworkId" in existingHeatSource
		) {
			return !!existingHeatSource.associatedHeatNetworkId;
		}

		return false;
	}

	return (
		heatSourceForm.data.typeOfHeatSource === "heatPump" &&
		heatSourceForm.data.typeOfHeatPump === "booster" &&
		!!heatSourceForm.data.associatedHeatNetworkId
	);
}

const heatSourceMaxNumberOfItems = computed(() => {
	const firstHeatSource = dhwHeatSources.data[0];

	return firstHeatSource && isHeatPumpConnectedToExistingHeatNetwork(firstHeatSource) ? 1 : 2;
});

function handleComplete() {
	clearErrors();

	const { waterStorage, preheatedWaterStorage, pipework, hotWaterOutlets } = store.domesticHotWater;

	const hasOtherHotWaterOutlet = hotWaterOutlets.data.some(
		(outlet) => outlet.data.typeOfHotWaterOutlet === "otherHotWaterOutlet",
	);

	const hasWaterStorage = waterStorage.data.length > 0;

	if (!hasOtherHotWaterOutlet) {
		addError({ 
			id: "hotWaterOutletNoOtherTypeError", 
			text: "You must add at least one hot water outlet that has the type 'other'", 
			href: `${page?.url}/hot-water-outlets/create`,
		});
	}

	if (heatSourceRequiresWaterStorage() && !hasWaterStorage) {
		addError({
			id: "waterStorageRequiredError",
			text: "Water storage must be added when the heat source is an immersion heater, solar thermal system or heat pump",
			href: `${page?.url}/water-storage/create`,
		});
	}

	const preheatedWaterCylinders = preheatedWaterStorage.data.map(x => x.data.id);

	if (preheatedWaterCylinders.length && !pipework.data.some(x => preheatedWaterCylinders.includes(x.data.waterStorage))) {
		addError({
			id: "preheatedWaterStoragePipeworkRequiredError",
			text: "You must add the primary pipework associated to the pre-heated water tank.",
			href: getUrl("pipeworkCreate"),
		});
	}

	const hotWaterCylinders = waterStorage.data.map(x => x.data.id);

	if (hotWaterCylinders.length && !pipework.data.some(x => hotWaterCylinders.includes(x.data.waterStorage))) {
		addError({
			id: "waterStoragePipeworkRequiredError",
			text: "You must add the primary pipework associated to the hot water cylinder.",
			href: getUrl("pipeworkCreate"),
		});
	}
	
	if (errorMessages.value.length > 0) return;

	store.$patch({
		domesticHotWater: {
			waterStorage: { complete: true },
			preheatedWaterStorage: { complete: true },
			wwhrs: { complete: true },
			hotWaterOutlets: { complete: true },
			pipework: { complete: true },
			heatSources: { complete: true },
		},
	});

	navigateTo("/");
}

const hasIncompleteOrInvalidEntries = () => {
	if ((dhwHeatSources.data.length > heatSourceMaxNumberOfItems.value) || !!errorMessages.value.length) {
		return true;
	}

	return Object.values(store.domesticHotWater)
		.some(section => {
			if (isEcaasForm(section)) {
				return section.data.some(item => isEcaasForm(item) && !item.complete);
			}
			
			return false;
		});
};

function getNameFromSpaceHeatingHeatSource(heatSourceId: string) {
	const heatSource = store.spaceHeating.heatSource.data.find(x => x.data.id === heatSourceId);
	return heatSource ? heatSource.data.name : undefined;
}

function checkMaxHeatSourcesExceeded() {
	const heatSourcesExcludingPackaged = dhwHeatSources.data.filter(x => !hasPackagedProduct(x.data));

	if (heatSourcesExcludingPackaged.length <= 1) {
		return;
	}

	const preheatedHeatSourceId = preheatedWaterStorage.data[0]?.data.heatSourceId;
	const preheatedHeatSource = heatSourcesExcludingPackaged.find(x => x.data.id === preheatedHeatSourceId);

	if (preheatedHeatSource) {
		if (heatSourcesExcludingPackaged.length === 2) {
			return;
		}

		addError({
			id: "heatSourceLimitExceededError",
			text: "You can only have two heat sources for domestic hot water. Please delete any heat sources that should not be used.",
			disableLink: true,
		});

		return;
	}

	addError({
		id: "heatSourceLimitExceededError",
		text: "You can only have two heat sources if one is connected to a pre-heated water tank.",
		disableLink: true,
	});
}

function heatSourceRequiresWaterStorage() {
	const dhwHeatSourcesRequiringWaterStorage = [
		"immersionHeater",
		"solarThermalSystem",
		"heatPump",
	];

	const requiresWaterStorage = store.domesticHotWater.heatSources.data.some(
		(heatSource) => {
			const heatSourceType = getDhwHeatSourceType(heatSource);
			return heatSourceType ? dhwHeatSourcesRequiringWaterStorage.includes(heatSourceType) : false;
		},
	);

	const hasSpaceHeatingHeatPump =
		hasReferenceToExistingSpaceHeatingHeatPump();
	
	return requiresWaterStorage || hasSpaceHeatingHeatPump;
}

function hasReferenceToExistingSpaceHeatingHeatPump(): boolean {
	return store.domesticHotWater.heatSources.data.some((dhwHeatSource) => {
		if (!dhwHeatSource.data.isExistingHeatSource) return false;

		const linkedHeatSource = store.spaceHeating.heatSource.data.find(
			(shHeatSource) => shHeatSource.data.id === dhwHeatSource.data.heatSourceId,
		);

		return linkedHeatSource?.data.typeOfHeatSource === "heatPump";
	});
}

const waterStorageConflictMessage = computed<ConflictMessage | undefined>(() => {
	let incompatibleType: string | undefined;

	store.domesticHotWater.heatSources.data.forEach((heatSource) => {
		const actualHeatSource = getActualHeatSource(heatSource.data);
		const heatSourceType = actualHeatSource?.typeOfHeatSource;

		if (
			heatSourceType === "boiler" &&
			actualHeatSource!.typeOfBoiler === "combiBoiler"
		) {
			incompatibleType = boilerTypes[actualHeatSource!.typeOfBoiler];
			return;
		}

		if (
			heatSourceType === "heatInterfaceUnit" ||
			heatSourceType === "heatBattery" ||
			heatSourceType === "pointOfUse"
		) {
			incompatibleType = displayDHWHeatSourceType(heatSourceType);
		}
	});

	if (!incompatibleType) {
		return;
	}

	return {
		beforeLinkText: `No water storage can be added when '${incompatibleType.toLowerCase()}' is selected as the heat source.`,
	};
});

checkMaxHeatSourcesExceeded();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovErrorSummary v-if="errorMessages.length > 0" :error-list="errorMessages" test-id="domesticHotWaterErrorSummary"/>
	<CustomList 
		id="heatSources"
		title="Heat source"
		:form-url="`${page?.url!}/heat-sources`"
		:items="
			store.domesticHotWater.heatSources.data
				.filter(x => isEcaasForm(x))
				.map(x => {
					const heatSource = x as EcaasForm<HeatSourceData>;

					const item: CustomListItem = {
						name: x.data.isExistingHeatSource ? getNameFromSpaceHeatingHeatSource(x.data.heatSourceId)! : x.data.name,
						status: x.complete ? formStatus.complete : formStatus.inProgress,
						...(hasPackagedProduct(heatSource.data) || (x.data.isExistingHeatSource && x.data.createdAutomatically) ? {
							actions: ['edit']
						} : {})
					};

					return item;
				})
		"
		:show-status="true"
		:max-number-of-items="heatSourceMaxNumberOfItems"
		section="dHWHeatSources"
		@remove="(index: number) => removeEntry('heatSources', index)"
	/>

	<CustomList 
		id="wwhrs"
		title="Waste water heat recovery systems (optional)"
		:form-url="`${page?.url!}/wwhrs`"
		:items="store.domesticHotWater.wwhrs.data
			.filter(x => isEcaasForm(x))
			.map(x => {
				const item: CustomListItem = {
					name: x.data.name,
					status: x.complete ? formStatus.complete : formStatus.inProgress,
				};

				return item;
			})"
		:show-status="true"
		@remove="(index: number) => removeEntry('wwhrs', index)"
		@duplicate="(index: number) => duplicateEntry('wwhrs', index)"
	/>

	<CustomList 
		id="preheatedWaterStorage"
		title="Pre-heated water cylinder (optional)"
		:form-url="`${page?.url!}/preheated-water-storage`"
		:items="store.domesticHotWater.preheatedWaterStorage.data
			.filter(x => isEcaasForm(x))
			.map(x => {
				const preheatedWaterStorage = x as EcaasForm<PreheatedWaterStorageData>;

				const item: CustomListItem = {
					name: x.data.name,
					status: x.complete ? formStatus.complete : formStatus.inProgress,
					...(hasPackagedProduct(preheatedWaterStorage.data) ? {
						actions: ['edit']
					} : {
						actions: ['edit', 'delete']
					})
				};

				return item;
			})"
		:show-status="true"
		:max-number-of-items="1"
		@remove="(index: number) => removeEntry('preheatedWaterStorage', index)"
		@duplicate="(index: number) => duplicateEntry('preheatedWaterStorage', index)"
	/>

	<CustomList 
		id="waterStorage"
		title="Hot water cylinder (optional)"
		:form-url="`${page?.url!}/water-storage`"
		:items="store.domesticHotWater.waterStorage.data
			.filter(x => isEcaasForm(x))
			.map(x => {
				const waterStorage = x as EcaasForm<WaterStorageData>;

				const item: CustomListItem = {
					name: x.data.name,
					status: x.complete ? formStatus.complete : formStatus.inProgress,
					...(hasPackagedProduct(waterStorage.data) ? {
						actions: ['edit']
					} : {})
				};

				return item;
			})"
		:conflict-message="waterStorageConflictMessage"
		:show-status="true"
		@remove="(index: number) => removeEntry('waterStorage', index)"
		@duplicate="(index: number) => duplicateEntry('waterStorage', index)"
	/>

	<CustomList
		id="hotWaterOutlets"
		title="Hot water outlets"
		:form-url="`${page?.url!}/hot-water-outlets`"
		:items="store.domesticHotWater.hotWaterOutlets.data
			.filter(x => isEcaasForm(x))
			.map(x=>({name: x.data.name, status: x.complete ? formStatus.complete : formStatus.inProgress}))"
		:show-status="true"
		@remove="(index: number) => removeEntry('hotWaterOutlets', index)"
		@duplicate="(index: number) => duplicateEntry('hotWaterOutlets', index)"
	/>

	<CustomList 
		id="pipework"
		title="Primary pipework"
		:form-url="`${page?.url!}/pipework`"
		:items="store.domesticHotWater.pipework.data
			.filter(x => isEcaasForm(x))
			.map(x=>({name: x.data.name, status: x.complete ? formStatus.complete : formStatus.inProgress}))"
		:show-status="true"
		@remove="(index: number) => removeEntry('pipework', index)"
		@duplicate="(index: number) => duplicateEntry('pipework', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/"
			secondary
		>
			Return to overview
		</GovButton>
		<NuxtLink :to="`${page?.url}/summary`" class="govuk-button govuk-button--secondary">View summary</NuxtLink>
		<CompleteElement
			:is-complete="Object.values(store.domesticHotWater).every(section => section.complete)"
			:disabled="hasIncompleteOrInvalidEntries()"
			@completed="handleComplete"/>
	</div>
</template>