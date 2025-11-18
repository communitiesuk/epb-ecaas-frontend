<script setup lang="ts">
import type { FormKitFrameworkContext } from "@formkit/core";
import { showErrorState, getErrorMessage } from "#imports";

const props = defineProps<{
	context: FormKitFrameworkContext
}>();

const { label, help, id, attrs: { "selected-product-reference": selectedProductReference } } = props.context;
</script>

<template>
	<div :data-testid="id" :class="`govuk-form-group ${showErrorState(props.context) ? 'govuk-form-group--error' : ''}`">
		<label class="govuk-label govuk-label--m">
			{{ label }}
		</label>
		<div v-if="help" :id="`${id}_hint`" class="govuk-hint">{{ help }}</div>
		<p v-if="props.context.state.invalid" class="govuk-error-message" :data-testid="`${id}_error`">
			<span class="govuk-visually-hidden">Error:</span> {{ getErrorMessage(props.context) }}
		</p>
		<GovButton v-show="!selectedProductReference" data-testId="chooseAProductButton" href="/heating-and-cooling-systems/heat-generation/heat-pump/0/air-source-products">
			Choose a product
		</GovButton>
		<div v-if="selectedProductReference">
			<ul class="govuk-list">
				<li>Product reference: <span class="bold">{{ selectedProductReference}}</span></li>
				<li>Brand: <span class="bold">Koef</span></li>
				<li>Model: <span class="bold">Heat pump model 1</span></li>
				<li>Model Qualifier: <span class="bold">Heat pump Qualifier</span></li>
				<li>Flow temperature: <span class="bold">45</span></li>
			</ul>
			<GovButton secondary data-testId="selectAProductButton" href="/heating-and-cooling-systems/heat-generation/heat-pump/0/air-source-products">
				Select a different product
			</GovButton>
		</div>
	</div>
</template>

<style scoped lang="scss">

govuk-list {
	line-height: 1.2;
}

.bold {
	font-weight: bold;
}
</style>
