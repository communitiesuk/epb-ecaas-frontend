<script setup lang="ts">
const emit = defineEmits(["completed"]);

defineProps<{isComplete: boolean}>();
</script>

<template>
	<GovButton v-show="!isComplete" data-testid="completeSection" @click="emit('completed')">
		Mark section as complete
	</GovButton>
	<div v-show="isComplete" role="status" class="app-status-element">
		Completed
	</div>
</template>

<style lang="scss" scoped>

.app-status-element {
  font-family: "GDS Transport", arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  font-weight: 400;
  font-size: 1.1875rem;
  line-height: 1;
  padding: 8px 10px 7px;
  border: 2px solid transparent;
  color: #b1b4b6;
  background-color: #f3f2f1;
  box-shadow: 0 2px 0 #b1b4b6;
}
</style>