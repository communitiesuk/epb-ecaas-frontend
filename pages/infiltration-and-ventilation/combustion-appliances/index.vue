<script setup lang="ts">
const page = usePage();
const title = "Combustion appliances";
const store = useEcaasStore();

type ApplianceType = keyof typeof store.infiltrationAndVentilation.combustionAppliances;

interface ApplianceData extends CombustionApplianceData, ClosedFireplaceWithFanData, OpenGasFlueBalancerData, OpenGasKitchenStoveData, OpenGasFireData, ClosedFireData {
}

function handleRemove(applianceType: ApplianceType, index: number) {
	const appliances = store.infiltrationAndVentilation.combustionAppliances[applianceType]?.data;

	if (appliances) {
		appliances.splice(index, 1);

		store.$patch((state) => {
			state.infiltrationAndVentilation.combustionAppliances[applianceType]!.data = appliances.length ? appliances : [];
			state.infiltrationAndVentilation.combustionAppliances[applianceType]!.complete = appliances.length > 0;
		});
	}
}

function handleDuplicate<T extends ApplianceData>(applianceType: ApplianceType, index: number) {
	const appliances = store.infiltrationAndVentilation.combustionAppliances[applianceType]?.data;
	const appliance = appliances?.[index];

	if (appliance) {
		const duplicates = appliances.filter(a => a.name.match(duplicateNamePattern(appliance.name)));

		store.$patch((state) => {
			const newAppliance = {
				...appliance,
				name: `${appliance.name} (${duplicates.length})`
			} as T;

			state.infiltrationAndVentilation.combustionAppliances[applianceType]!.data.push(newAppliance);
		});
	}
}

</script>

<template>

	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<GovCustomList
		id="openFireplace"
		title="Open fireplace"
		:form-url="`${page?.url!}/open-fireplace`"
		:items="store.infiltrationAndVentilation.combustionAppliances.openFireplace.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('openFireplace', index)"
		@duplicate="(index: number) => handleDuplicate('openFireplace', index)"
	/>
	<GovCustomList
		id="closedFireplaceWithFan"
		title="Closed fireplace with fan"
		:form-url="`${page?.url!}/closed-fireplace-with-fan`"
		:items="store.infiltrationAndVentilation.combustionAppliances.closedFireplaceWithFan.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('closedFireplaceWithFan', index)"
		@duplicate="(index: number) => handleDuplicate('closedFireplaceWithFan', index)"
	/>
	<GovCustomList
		id="openGasFlueBalancer"
		title="Open gas flue balancer"
		:form-url="`${page?.url!}/open-gas-flue-balancer`"
		:items="store.infiltrationAndVentilation.combustionAppliances.openGasFlueBalancer.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('openGasFlueBalancer', index)"
		@duplicate="(index: number) => handleDuplicate('openGasFlueBalancer', index)"
	/>
	<GovCustomList
		id="openGasKitchenStove"
		title="Open gas kitchen stove"
		:form-url="`${page?.url!}/open-gas-kitchen-stove`"
		:items="store.infiltrationAndVentilation.combustionAppliances.openGasKitchenStove.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('openGasKitchenStove', index)"
		@duplicate="(index: number) => handleDuplicate('openGasKitchenStove', index)"
	/>
	<GovCustomList
		id="openGasFire"
		title="Open gas fire"
		:form-url="`${page?.url!}/open-gas-fire`"
		:items="store.infiltrationAndVentilation.combustionAppliances.openGasFire.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('openGasFire', index)"
		@duplicate="(index: number) => handleDuplicate('openGasFire', index)"
	/>
	<GovCustomList
		id="closedFire"
		title="Closed fire"
		:form-url="`${page?.url!}/closed-fire`"
		:items="store.infiltrationAndVentilation.combustionAppliances.closedFire.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('closedFire', index)"
		@duplicate="(index: number) => handleDuplicate('closedFire', index)"
	/>
	<GovButton href="/infiltration-and-ventilation" secondary>
		Return to overview
	</GovButton>
</template>
