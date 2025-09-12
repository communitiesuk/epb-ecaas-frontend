import redisDriver from "unstorage/drivers/redis";

export default defineNitroPlugin(() => {

	const storage = useStorage();

	if (process.env.NODE_ENV === "production") {
		const driver = redisDriver({
			base: "{unstorage}",
			port: 6379,
			host: useRuntimeConfig().redisEndpoint,
			password: useRuntimeConfig().redisPassword,
			username: useRuntimeConfig().redisUsername,
			tls: {},
		});
		storage.mount("cache", driver);
	}
});
