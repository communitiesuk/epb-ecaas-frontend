<script setup lang="ts">
import type { Product } from "~/pcdb/pcdb.types";
import { displayTechnologyType } from "~/utils/display";

defineProps<{ packagedProduct: Product; }>();
</script>

<template>
	<GovInset>
		<p>This product comes with the {{ packagedProduct.modelName }} {{ displayTechnologyType(packagedProduct.technologyType, false) }} selected in heat sources, so some data entries are unchangeable.</p>
		<p>If you want to add a different boiler then choose a different heat source product.</p>
	</GovInset>
</template>