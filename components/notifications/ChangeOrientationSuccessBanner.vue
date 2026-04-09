<script setup lang="ts">
defineProps<{
	difference: number,
	orientation: number
}>();
function getRotation(difference: number) {
	return difference < 0 ? `${Math.abs(difference)}° anticlockwise` : `${difference}° clockwise`;
}
</script>


<template>
	<GovNotificationBanner heading="Orientation has been changed." :success-type="true">
		<p class="govuk-body" data-testid="orientationChange">
			The dwelling has been rotated {{ getRotation(difference) }}. Now the front door is oriented at <span class="bold">{{ orientation }}° from true north.</span>
		</p>
		<p>
			Please check the distant shading section and make any necessary adjustments, as it may now be inaccurate.
		</p>
	</GovNotificationBanner>
</template>

<style scoped lang="scss">
.bold {
	font-weight: bold;
}
</style>