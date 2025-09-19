<script setup lang="ts">
import { onUnmounted } from "vue";
import { useBanner } from "~/composables/banner";

const banner = useBanner();

onUnmounted(() => {
	// remove banner from state after showing it once
	banner.value = null;
});
</script>

<template>
	<NotificationsImportSuccessBanner v-if="banner === 'import-complete'" />
	<NotificationsImportSuccessWithUpdateBanner v-else-if="banner === 'import-caused-update'" />
</template>