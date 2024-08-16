
// doesn't need to be efficient, just needs to work
export const splitIntoBatches = <T>(array: T[], batchSize = 20): T[][] => {
  const batches: T[][] = []
  for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize))
  }
  return batches
}