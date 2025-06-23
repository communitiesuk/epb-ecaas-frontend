export const postEcaasState = async (state: EcaasState) => {
	try {
		await $fetch("/api/setState", {
			method: "POST",
			body: state,
		});
	} catch (error) {
		console.error(`Failed to post data: ${error}`);
	}
};
