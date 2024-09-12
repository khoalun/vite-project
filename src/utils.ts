/**
 * Generate the smallest missing integer ID that is not present in the list of existing IDs.
 * @param existingIds - Array of existing integer IDs.
 * @returns A unique integer ID.
 */
export const generateSmallestUniqueId = (existingIds: number[]): number => {
  if (!existingIds || existingIds.length === 0) {
    return 1; // Return 1 if the list is empty
  }

  // Sort the array of existing IDs to find the smallest missing ID
  const sortedIds = [...existingIds].sort((a, b) => a - b);

  // Look for the first missing number in the sorted array
  let newId = 1;
  for (let id of sortedIds) {
    if (id === newId) {
      newId++; // Increment if the id exists in the sorted list
    } else if (id > newId) {
      break; // Stop if we find a gap
    }
  }

  return newId;
};
