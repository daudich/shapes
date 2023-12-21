export default class ArrayUtils {
  /**
   * Find and return values which are being duplicated in the array.
   *
   * @param arr Array to evaluate.
   * @returns Array with values which are duplicated in arr.
   */
  static findDuplicates<Type>(arr: Type[]): Type[] {
    const sortedArray: Type[] = arr.sort();
    const duplicates: Type[] = [];

    arr.forEach((e, i) => {
      if (sortedArray[i] === sortedArray[i + 1]) {
        duplicates.push(sortedArray[i]);
      }
    });

    return duplicates;
  }
}
