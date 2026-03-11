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
	<NotificationsFrontDoorNowInvalidBanner v-if="banner?.type === 'update-front-door'"  data-testid="doorBanner" />
</template>