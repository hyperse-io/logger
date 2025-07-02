export async function sleep(ms = 1000) {
  return await new Promise<void>((resolver) => {
    setTimeout(resolver, ms);
  });
}
