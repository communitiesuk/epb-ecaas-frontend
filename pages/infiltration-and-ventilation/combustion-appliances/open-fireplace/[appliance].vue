<script setup lang="ts">

const title = "Open fireplace";
const store = useEcaasStore();
const route = useRoute();

const applianceData = useItemToEdit('combustion', store.infiltrationAndVentilation.combustionAppliances.openFireplace.data);
const model: Ref<OpenFireplaceData> = ref(applianceData!);

const saveForm = (fields: OpenFireplaceData) => {
	store.$patch((state) => {
		const { combustionAppliances } = state.infiltrationAndVentilation;

		if(!combustionAppliances.openFireplace.data) {
			combustionAppliances.openFireplace.data = [];
		}

		const appliance: OpenFireplaceData = {
			name: fields.name,
			airSupplyToAppliance: fields.airSupplyToAppliance,
			exhaustMethodFromAppliance: fields.exhaustMethodFromAppliance,
			typeOfFuel: fields.typeOfFuel,
		};

		if (route.params.combustion && route.params.combustion !== 'create') {
			const index = parseInt(route.params.combustion as string);
			combustionAppliances.openFireplace.data[index] = appliance;
		} else {
			combustionAppliances.openFireplace.data.push(appliance);
		}

		combustionAppliances.openFireplace.complete = true;
	});

	navigateTo("/infiltration-and-ventilation/combustion-appliances");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
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
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary :error-list="errorMessages" test-id="openFireplaceErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this open fireplace so that it can be identified later."
			name="name"
			validation="required"
		/>
		<FormKit
			id="airSupplyToAppliance"
			type="govRadios"
			label="Air supply to appliance"
			name="airSupplyToAppliance"
			validation="required"
			:options="{ roomAir: 'Room air', outside: 'Outside' }"
		/>
		<FormKit
			id="exhaustMethodFromAppliance"
			type="govRadios"
			label="Exhaust method from appliance"
			name="exhaustMethodFromAppliance"
			validation="required"
			:options="{
				intoRoom: 'Into room',
				intoSeparateDuct: 'Into separate duct',
				intoMechanicalVent: 'Into mechanical vent',
			}"
		/>
		<FormKit
			id="typeOfFuel"
			type="govRadios"
			label="Type of fuel"
			name="typeOfFuel"
			validation="required"
			:options="{
				wood: 'Wood',
				oil: 'Oil',
				gas: 'Gas',
				coal: 'Coal'
			}"
		/>

		<FormKit
			type="govButton"
			label="Save and continue"
		/>
	</FormKit>
</template>
