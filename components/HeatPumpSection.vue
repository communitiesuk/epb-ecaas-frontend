<script setup lang="ts">
import { getUrl, type HeatSourceData, uniqueName } from "#imports";
import type { PageId } from "~/data/pages/pages";
import { heatPumpTypes } from "../utils/display";
const route = useRoute();
const store = useEcaasStore();

type HeatPumpSectionPage = "space-heating" | "domestic-hot-water";

const { model } = defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": "heatPump" }>;
	index: number;
	boilers: [string, string][];
	addBoilerPageId: PageId;
	page: HeatPumpSectionPage;
}>();

const heatSources = getCombinedHeatSources(store);

const requireBoiler = model.productReference && model.backupCtrlType === "TopUp" && !model.powerMaxBackup;

const shHeatPumpOptions = {
	"airSource": heatPumpTypes["airSource"],
	"groundSource": heatPumpTypes["groundSource"],
	"waterSource": heatPumpTypes["waterSource"],
	"booster": heatPumpTypes["booster"],
	"exhaustAirMev": heatPumpTypes["exhaustAirMev"],
	"exhaustAirMvhr": heatPumpTypes["exhaustAirMvhr"],
	"exhaustAirMixed": heatPumpTypes["exhaustAirMixed"],
};

const dhwHeatPumpOptions = {
	"hotWaterOnly": heatPumpTypes["hotWaterOnly"],
	"airSource": heatPumpTypes["airSource"],
	"groundSource": heatPumpTypes["groundSource"],
	"waterSource": heatPumpTypes["waterSource"],
	"booster": heatPumpTypes["booster"],
};

const _heatPumpTypeOptionsMap = {
	"space-heating": shHeatPumpOptions,
	"domestic-hot-water": dhwHeatPumpOptions,
} as const satisfies Record<HeatPumpSectionPage, Partial<Record<HeatPumpType, string>>>;
//keeping this for now, will need to differentiate later which PCDB products get shown based on whether it's DHW or SH

</script>

<template>
	<FormKit
		id="name"
		:value="model.name"
		type="govInputText"
		label="Name"
		help="Provide a name for this element so that it can be identified later"
		name="name"
		:validation-rules="{ uniqueName: uniqueName(heatSources, { id: model.id }) }"
		validation="required | uniqueName"
		:validation-messages="{
			uniqueName: 'An element with this name in domestic hot water or space heating already exists. Please enter a unique name.'
		}" />
	<FieldsSelectPcdbProduct
		help="Select the heat pump type from the PCDB using the button below"
		:selected-product-reference="model.productReference"
		:selected-product-type="'heatPump' /* this might need to be updated to pass through either which of DHW or SH, or just the list of different products */"
		:page-url="route.fullPath"
		:page-index="index" />
	<FormKit
		v-if="requireBoiler"
		id="backupBoiler"
		type="govRadios"
		:options="new Map(boilers)"
		label="Back up boiler"
		help="Select the boiler that has been added previously which will be used as the backup for the heat pump"
		name="backupBoiler"
		validation="required"
	>
		<div v-if="!boilers.length">
			<p class="govuk-error-message">No boilers added.</p>
			<NuxtLink :to="getUrl(addBoilerPageId)" class="govuk-link gov-radios-add-link">
				Click here to add a boiler
			</NuxtLink>
		</div>
	</FormKit>
</template>