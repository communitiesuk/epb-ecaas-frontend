import redisDriver from "unstorage/drivers/redis";

export default defineNitroPlugin(() => {
  const storage = useStorage();

  if (process.env.NODE_ENV === "production") {
    const driver = redisDriver({
      base: "{unstorage}",
      cluster: [
        {
          port: 6379,
          host: useRuntimeConfig().redisEndpoint,
        },
      ],
      clusterOptions: {
        redisOptions: {
          tls: {},
					password: useRuntimeConfig().redisPassword,
        },
      },
    });

    storage.mount("cache", driver);
  }
});
