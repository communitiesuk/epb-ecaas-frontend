/**
 * Sets a variable to true when component has mounted in the browser
 * @returns State of mounted variable
 */
export function useMounted() {
	const mounted = ref(false);
	onMounted(() => mounted.value = true);

	return { mounted };
}