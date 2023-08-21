import { getRandomInt } from "../util";

export async function createSessionParams(session: Electron.Session) {
  const history_len = getRandomInt(1, 10); // Random history length
  const screen_height = getRandomInt(600, 1080); // Random screen height
  const screen_width = getRandomInt(800, 1920); // Random screen width

  //   const timezone = await session.evaluate(
  //     "() => Intl.DateTimeFormat().resolvedOptions().timeZone"
  //   );
}
