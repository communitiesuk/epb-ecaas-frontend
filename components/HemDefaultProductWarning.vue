<script setup lang="ts">
defineProps<{
	brandNames: (string | undefined)[];
}>();
</script>

<template>
	<GovWarningText v-if="brandNames.some(x => x?.includes('HEM Default'))" data-testid="hemDefaultProductWarning">
		A HEM Default product has been selected. This should not be used for an "As Built" BREL report.
	</GovWarningText>
</template>