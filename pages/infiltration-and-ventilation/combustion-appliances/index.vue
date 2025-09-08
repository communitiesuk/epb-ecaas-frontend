<script setup lang="ts">
import { CombustionApplianceType } from "~/schema/api-schema.types";

const page = usePage();
const title = "Combustion appliances";
const store = useEcaasStore();

type ApplianceType = keyof typeof store.infiltrationAndVentilation.combustionAppliances;

function handleRemove(applianceType: ApplianceType, index: number) {
	const appliances = store.infiltrationAndVentilation.combustionAppliances[applianceType]?.data;

	if (appliances) {
		appliances.splice(index, 1);

		store.$patch((state) => {
			state.infiltrationAndVentilation.combustionAppliances[applianceType].data = appliances.length ? appliances : [];
			state.infiltrationAndVentilation.combustionAppliances[applianceType].complete = false;
		});
	}
}

function handleDuplicate(applianceType: ApplianceType, index: number) {
	const appliances = store.infiltrationAndVentilation.combustionAppliances[applianceType]?.data;
	const appliance = appliances?.[index];

	if (appliance) {
		const duplicates = appliances.filter(a => a.name.match(duplicateNamePattern(appliance.name)));

		store.$patch((state) => {
			const newAppliance = {
				...appliance,
				name: `${appliance.name} (${duplicates.length})`
			};

			state.infiltrationAndVentilation.combustionAppliances[applianceType].data.push(newAppliance);
			state.infiltrationAndVentilation.combustionAppliances[applianceType].complete = false;
		});
	}
}
function handleComplete() {
	store.$patch({
		infiltrationAndVentilation: {
			combustionAppliances: {
				[CombustionApplianceType.open_fireplace]: { complete: true },
				[CombustionApplianceType.closed_with_fan]: { complete: true },
				[CombustionApplianceType.open_gas_flue_balancer]: { complete: true },
				[CombustionApplianceType.open_gas_kitchen_stove]: { complete: true },
				[CombustionApplianceType.open_gas_fire]: { complete: true },
				[CombustionApplianceType.closed_fire]: { complete: true }
			}
		}
	});

	navigateTo("/infiltration-and-ventilation");
}

function checkIsComplete(){
	const appliances = store.infiltrationAndVentilation.combustionAppliances;
	return Object.values(appliances).every(appliance => appliance.complete);
}

</script>

<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<CustomList
		id="openFireplace"
		title="Open fireplace"
		:form-url="`${page?.url!}/open-fireplace`"
		:items="store.infiltrationAndVentilation.combustionAppliances[CombustionApplianceType.open_fireplace].data.map(x => x.name)"
		@remove="(index: number) => handleRemove(CombustionApplianceType.open_fireplace, index)"
		@duplicate="(index: number) => handleDuplicate(CombustionApplianceType.open_fireplace, index)"
	/>
	<CustomList
		id="closedFireplaceWithFan"
		title="Closed fireplace with fan"
		:form-url="`${page?.url!}/closed-fireplace-with-fan`"
		:items="store.infiltrationAndVentilation.combustionAppliances[CombustionApplianceType.closed_with_fan].data.map(x => x.name)"
		@remove="(index: number) => handleRemove(CombustionApplianceType.closed_with_fan, index)"
		@duplicate="(index: number) => handleDuplicate(CombustionApplianceType.closed_with_fan, index)"
	/>
	<CustomList
		id="openGasFlueBalancer"
		title="Open gas flue balancer"
		:form-url="`${page?.url!}/open-gas-flue-balancer`"
		:items="store.infiltrationAndVentilation.combustionAppliances[CombustionApplianceType.open_gas_flue_balancer].data.map(x => x.name)"
		@remove="(index: number) => handleRemove(CombustionApplianceType.open_gas_flue_balancer, index)"
		@duplicate="(index: number) => handleDuplicate(CombustionApplianceType.open_gas_flue_balancer, index)"
	/>
	<CustomList
		id="openGasKitchenStove"
		title="Open gas kitchen stove"
		:form-url="`${page?.url!}/open-gas-kitchen-stove`"
		:items="store.infiltrationAndVentilation.combustionAppliances[CombustionApplianceType.open_gas_kitchen_stove].data.map(x => x.name)"
		@remove="(index: number) => handleRemove(CombustionApplianceType.open_gas_kitchen_stove, index)"
		@duplicate="(index: number) => handleDuplicate(CombustionApplianceType.open_gas_kitchen_stove, index)"
	/>
	<CustomList
		id="openGasFire"
		title="Open gas fire"
		:form-url="`${page?.url!}/open-gas-fire`"
		:items="store.infiltrationAndVentilation.combustionAppliances[CombustionApplianceType.open_gas_fire].data.map(x => x.name)"
		@remove="(index: number) => handleRemove(CombustionApplianceType.open_gas_fire, index)"
		@duplicate="(index: number) => handleDuplicate(CombustionApplianceType.open_gas_fire, index)"
	/>
	<CustomList
		id="closedFire"
		title="Closed fire"
		:form-url="`${page?.url!}/closed-fire`"
		:items="store.infiltrationAndVentilation.combustionAppliances[CombustionApplianceType.closed_fire].data.map(x => x.name)"
		@remove="(index: number) => handleRemove(CombustionApplianceType.closed_fire, index)"
		@duplicate="(index: number) => handleDuplicate(CombustionApplianceType.closed_fire, index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/infiltration-and-ventilation"
			secondary
		>
			Return to infiltration and ventilation
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" @completed="handleComplete"/>
	</div>
</template>
