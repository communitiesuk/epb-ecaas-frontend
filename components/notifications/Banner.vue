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
	<NotificationsImportSuccessBanner v-if="banner?.type === 'import-complete'" />
	<NotificationsImportSuccessWithUpdateBanner v-else-if="banner?.type === 'import-caused-update'" />
	<NotificationsChangeOrientationSuccessBanner v-else-if="banner?.type === 'change-orientation-complete'" :difference="banner.difference" :orientation="banner.orientation"  />
</template>