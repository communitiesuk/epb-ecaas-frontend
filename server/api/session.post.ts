import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let sessionId = getCookie(event, "sessionId");

  if (sessionId) {
    // we may want to do the following to limit the amout of data being sent to the server:
    // const state = await storage.getItem<EcaasState>(sessionId);

    // Merge updated partial state with existing state
    // const newState = merge(state!, body);

    useStorage("dynamo").setItem(sessionId, body);
  } else {
    sessionId = uuidv4();
		const timestamp = Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60 * 1000;

    setCookie(event, "sessionId", sessionId, {
      maxAge: 60 * 60 * 24 * 14,
      httpOnly: true,
    });

    useStorage("dynamo").setItem(sessionId, body, { ttl: timestamp });
  }
  event.node.res.end();
});
