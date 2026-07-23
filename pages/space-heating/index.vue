<script setup lang="ts">
import formStatus from "~/constants/formStatus";
import type { CustomListItem } from "~/components/CustomList.vue";
import { hasPackagedProduct } from "~/utils/products";
import { useSpaceHeating } from "~/composables/spaceHeating";
import { EcaasError } from "~/errors.types";

const title = "Space heating";
const page = usePage();
const store = useEcaasStore();

type SpaceHeatingType = keyof typeof store.spaceHeating;

const { removeEntry, duplicateEntry } = useSpaceHeating();
const duplicationError = ref(false);

function handleDuplicate(spaceHeatingType: SpaceHeatingType, index: number) {
	try {
		duplicateEntry(spaceHeatingType, index);
	} catch (error: unknown) {
		if (error instanceof EcaasError && error.name === "DUPLICATION_ERROR") {
			duplicationError.value = true;
		}
	}
}

function handleComplete() {
	store.$patch({
		spaceHeating: {
			heatNetworks: { complete: true },
			heatSource: { complete: true },
			heatEmitters: { complete: true },
			heatingControls: { complete: true },
		},
	});

	navigateTo("/");
}

function clearAssociationsWithHeatNetwork(heatNetworkId?: string) {
	if (!heatNetworkId) return;
	store.$patch((state) => {

		state.spaceHeating.heatSource.data.forEach((heatSource) => {
			const typeOfHeatSource = heatSource.data?.typeOfHeatSource;
			if (
				(typeOfHeatSource === "heatPump" || typeOfHeatSource === "heatInterfaceUnit") &&
				(heatSource.data as { associatedHeatNetworkId: string | undefined }).associatedHeatNetworkId === heatNetworkId
			) {
				(heatSource.data as { associatedHeatNetworkId: string | undefined }).associatedHeatNetworkId = undefined;
				heatSource.complete = false;
				state.spaceHeating.heatSource.complete = false;
			} 
		});
	});
}

function handleRemove(type: "heatNetworks" | "heatSource" | "heatEmitters" | "heatingControls", index: number) {
	if (type === "heatSource") {
		duplicationError.value = false;
	}

	if (type === "heatNetworks") {
		const heatNetwork = store.spaceHeating.heatNetworks.data[index];
		clearAssociationsWithHeatNetwork(heatNetwork?.data.id);
	}

	removeEntry(type, index);
}

function checkIsComplete() {
	const sections = store.spaceHeating;
	return Object.values(sections).every((section) => section.complete);
}

function hasIncompleteEntries() {
	const spaceHeatingTypes = store.spaceHeating;

	return Object.values(spaceHeatingTypes).some((items) =>
		items.data.some((item) => (isEcaasForm(item) ? !item.complete : false)),
	);
}

const incompatibleHeatSourceForHeatNetworkMessage = computed(() => {
	for (const heatSource of store.spaceHeating.heatSource.data) {
		const data = heatSource.data as HeatSourceData | undefined;

		if (!data) {
			continue;
		}

		if (data.typeOfHeatSource === "boiler") {
			return "A heat network cannot be added as it isn't compatible with the boiler already entered.";
		}

		if (data.typeOfHeatSource === "heatBattery") {
			return "A heat network cannot be added as it isn't compatible with the heat battery already entered.";
		}

		if (
			data.typeOfHeatSource === "heatPump" &&
			data.typeOfHeatPump !== "booster"
		) {
			return "A heat network cannot be added as it isn't compatible with the heat pump already entered.";
		}
	}

	return undefined;
});

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<GovErrorSummary
		v-if="duplicationError"
		:error-list="[
			{
				id: 'duplicateHeatSource',
				text: 'There is another heat source that has a hot water cylinder attached as a packaged product. This cannot be duplicated as you cannot have multiple hot water heat sources or multiple hot water storage units.',
			}
		]"
		:use-links="false"
		test-id="duplicationError"
	/>
	<CustomList
		id="heatNetworks"
		title="Heat networks"
		:form-url="`${page?.url!}/heat-networks`"
		:items="
			store.spaceHeating.heatNetworks.data.map((x) => ({
				name: x.data?.name,
				status: x.complete ? formStatus.complete : formStatus.inProgress,
			}))
		"
		:show-status="true"
		:max-number-of-items="1"
		:conflict-message="incompatibleHeatSourceForHeatNetworkMessage"
		@duplicate="(index:number) => handleDuplicate('heatNetworks', index)"
		@remove="(index:number) => handleRemove('heatNetworks', index)"
	/>
	<CustomList
		id="heatSource"
		title="Heat sources"
		:form-url="`${page?.url!}/heat-source`"
		:items="
			store.spaceHeating.heatSource.data.map((x => {
				const heatSource = x as EcaasForm<HeatSourceData>;

				const item: CustomListItem = {
					name: heatSource.data?.name,
					status: heatSource.complete ? formStatus.complete : formStatus.inProgress,
					...(hasPackagedProduct(heatSource.data) ? {
						actions: ['edit']
					} : {}),
				};

				return item;
			}))
		"
		:show-status="true"
		@duplicate="(index: number) => handleDuplicate('heatSource', index)"
		@remove="(index: number) => handleRemove('heatSource', index)"
	/>
	<CustomList
		id="heatEmitters"
		title="Heat emitters"
		:form-url="`${page?.url!}/heat-emitters`"
		:items="
			store.spaceHeating.heatEmitters.data.map((x) => ({
				name: x.data?.name,
				status: x.complete ? formStatus.complete : formStatus.inProgress,
			}))
		"
		:show-status="true"
		@duplicate="(index: number) => handleDuplicate('heatEmitters', index)"
		@remove="(index: number) => removeEntry('heatEmitters', index)"
	/>
	<CustomList
		id="heatingControl"
		title="Heating controls"
		:form-url="`${page?.url!}/heating-controls`"
		:items="
			store.spaceHeating.heatingControls.data.map((x) => ({
				name: x.data?.name,
				status: x.complete ? formStatus.complete : formStatus.inProgress,
			}))
		"
		:show-status="true"
		:max-number-of-items="1"
		@remove="(index: number) => removeEntry('heatingControls', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/" secondary> Return to overview </GovButton>
		<NuxtLink
			:to="`${page?.url}/summary`"
			class="govuk-button govuk-button--secondary"
		>View summary</NuxtLink
		>
		<CompleteElement
			:is-complete="checkIsComplete()"
			:disabled="hasIncompleteEntries()"
			@completed="handleComplete"
		/>
	</div>
</template>