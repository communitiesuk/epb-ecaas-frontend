// export default defineNuxtPlugin(async() => {
// 	const store = useEcaasStore();
// 	try {

// 		const cachedData = await $fetch("/api/getState", {
// 			method: "GET",
// 		});
// 		if (cachedData){
// 			store.$patch(cachedData);

// 		} else {
// 			console.log("No cached data found");
// 		}
// 	} catch (error){
// 		console.error("Failed to get data from cache:", error);
// 	}
// });

