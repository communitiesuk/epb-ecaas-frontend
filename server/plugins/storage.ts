import redisDriver from "unstorage/drivers/redis";

export default defineNitroPlugin(() => {
	console.log("Creating redis driver with:", useRuntimeConfig().redisEndpoint);
	const storage = useStorage();

  if (process.env.NODE_ENV === "production") {
    const driver = redisDriver({
      base: "{unstorage}",
      port: 6379,
      host: useRuntimeConfig().redisEndpoint,
      password: useRuntimeConfig().redisPassword,
      username: useRuntimeConfig().redisUsername,
			tls: {}
    });
		storage.unmount("cache")
    storage.mount("cache", driver);
  }
});
