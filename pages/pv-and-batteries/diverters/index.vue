<script setup lang="ts">
import { getUrl } from "~/utils/page";

const title = "Diverters";
const store = useEcaasStore();

const divertersData = store.pvAndBatteries.diverters.data[0];
const model = ref(divertersData?.data);

const saveForm = (fields: PvDiverterData) => {
	store.$patch((state) => {
		const { diverters } = state.pvAndBatteries;

		const diverterItem: EcaasForm<PvDiverterData> = {
			data: {
				name: fields.name,
				hotWaterCylinder: fields.hotWaterCylinder,
			},
			complete: true,
		};
		
		diverters.data = [diverterItem];
		diverters.complete = false;
	});

	navigateTo("/pv-and-batteries");
};

watch(model, async (newData, initialData) => {
	const storeData = store.pvAndBatteries.diverters.data[0];

	if (initialData === undefined || newData === undefined) {
		return;
	}

	const defaultName = "Diverter";
	const isFirstEdit = Object.values(initialData).every(x => x === undefined) &&
			Object.values(newData).some(x => x !== undefined);

	for (const key of Object.keys(initialData) as (keyof typeof initialData)[]) {
		if (initialData[key]  !== newData[key]) {
			store.$patch(state => {
				if (!storeData && isFirstEdit) {
					state.pvAndBatteries.diverters.data = [{
						data: {
							...newData,
							name: newData.name?.trim() || defaultName,
						},
					}];
				} else {
					state.pvAndBatteries.diverters.data[0] = {
						data: {
							...newData,
							name: newData.name?.trim() || defaultName,
						},
					};
				}

				state.pvAndBatteries.diverters.complete = false;
			});
		}}
});

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
		<GovErrorSummary :error-list="errorMessages" test-id="divertersErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this diverter so it can be identified later"
			name="name"
			validation="required"
		/>
		<ClientOnly>
			<FormKit
				id="hotWaterCylinder"
				type="govRadios"
				:options="new Map(store.domesticHotWater.waterHeating.hotWaterCylinder.data
					.filter(x => x.data.id !== undefined)
					.map(x => [x.data.id as string, x.data.name]))"		
				label="Associated hot water cylinder"
				help="Select the hot water cylinder that this diverter is attached to"
				name="hotWaterCylinder"
				validation="required">
				<div v-if="!store.domesticHotWater.waterHeating.hotWaterCylinder.data.length">
					<p class="govuk-error-message">No hot water cylinder added.</p>
					<NuxtLink :to="getUrl('waterHeating')" class="govuk-link gov-radios-add-link">
						Click here to add a hot water cylinder
					</NuxtLink>
				</div>
			</FormKit>
		</ClientOnly>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('pvAndBatteries')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>