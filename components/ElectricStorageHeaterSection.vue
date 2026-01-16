<script setup lang="ts">
import type { ElectricStorageHeaterModelType } from "~/pages/space-heating-new/heat-emitters/[heatEmitter]/index.vue";

const route = useRoute();
const store = useEcaasStore();
const { getStoreIndex } = useForm();

defineProps<{
	model: ElectricStorageHeaterModelType
}>();
const heatSourceStoreData = store.spaceHeatingNew.heatSource.data;
const index = getStoreIndex(heatSourceStoreData);

</script>

<template>
	<FormKit id="name" type="govInputText" label="Name" name="name" validation="required" />
	<FormKit
		id="selectElectricStorageHeater" type="govPcdbProduct" label="Select product"
		name="selectElectricStorageHeater" validation="required" :help="''" :selected-product-reference="''"
		:selected-product-type="''" :page-url="''" :page-index="1" />
	<FormKit
		id="numOfStorageHeaters" name="numOfStorageHeaters" type="govInputInt" label="Number of storage heaters"
		help="Enter the number of storage heaters with this specification in the dwelling" />
</template>
