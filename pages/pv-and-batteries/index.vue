<script setup lang="ts">
import type { EcaasForm } from "~/stores/ecaasStore.schema";
import formStatus from "~/constants/formStatus";
import { isEcaasForm } from "#imports";

const title = "PV (photovoltaic) systems and electric batteries";
const page = usePage();
const store = useEcaasStore();

type PvAndBatteryType = keyof typeof store.pvAndBatteries;
type PvAndBatteryData = EcaasForm<PvSystemData> & EcaasForm<ElectricBatteryData> & EcaasForm<PvDiverterData>;

function handleRemove(pvAndBatteryType: PvAndBatteryType, index: number) {
	const data = store.pvAndBatteries[pvAndBatteryType]?.data;

	if (data) {
		data.splice(index, 1);

		store.$patch((state) => {
			state.pvAndBatteries[pvAndBatteryType].data = data.length ? data : [];
			state.pvAndBatteries[pvAndBatteryType].complete = false;
		});
	}
} 

function handleDuplicate<T extends PvAndBatteryData>(pvAndBatteryType: PvAndBatteryType, index: number) {
	const data = store.pvAndBatteries[pvAndBatteryType]?.data;
	const item = data?.[index];
	let name: string;
    
	if (item) {
		const duplicates = data.filter(f => {
			if (isEcaasForm(f) && isEcaasForm(item)) {
				name = item.data.name;
				return f.data.name.match(duplicateNamePattern(item.data.name));
			}
			return false;
		});

		store.$patch((state) => {
			const newItem = {
				complete: item.complete,
				data: {
					...item.data,
					name: `${name} (${duplicates.length})`,
				},
			} as T;

			state.pvAndBatteries[pvAndBatteryType].data.push(newItem);
			state.pvAndBatteries[pvAndBatteryType].complete = false;
		});
	}
}
function handleComplete() {
	store.$patch({
		pvAndBatteries: {
			pvSystems: { complete: true },
			electricBattery: { complete: true },
			diverters: { complete: true },
		},
	});

	navigateTo("/");
}

const hasIncompleteEntries = () =>
	Object.values(store.pvAndBatteries)
		.some(section => section.data.some(item => isEcaasForm(item) && !item.complete));

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<CustomList
		id="pvSystems"
		title="PV Systems"
		:form-url="`${page?.url!}/pv-systems`"
		:items="store.pvAndBatteries.pvSystems.data.filter(x => isEcaasForm(x)).map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('pvSystems', index)"
		@duplicate="(index: number) => handleDuplicate('pvSystems', index)"
	/>
	<CustomList
		id="electricBattery"
		title="Electric battery"
		hint="Only one electric battery can be added per energy supply"
		:form-url="`${page?.url!}/electric-battery`"
		:items="store.pvAndBatteries.electricBattery.data.filter(x => isEcaasForm(x)).map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		:max-number-of-items=1
		@remove="(index: number) => handleRemove('electricBattery', index)"
	/>
	<CustomList
		id="diverters"
		title="Diverters"
		:form-url="`${page?.url!}/diverters`"
		:items="store.pvAndBatteries.diverters.data.filter(x => isEcaasForm(x)).map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		:max-number-of-items=1
		@remove="(index: number) => handleRemove('diverters', index)"
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
			:is-complete="Object.values(store.pvAndBatteries).every(section => section.complete)"
			:disabled="hasIncompleteEntries()"
			@completed="handleComplete"/>
	</div>
</template>