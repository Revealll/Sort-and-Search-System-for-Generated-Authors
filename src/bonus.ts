
const T_0 = performance.now();
const DATA = loadJSON('../DO_NOT_TOUCH/data.json'); //Don't delete this line. All your data is here. It does take a few seconds for Replit to load the data because it's so large.

// Get HTML elements
const OPERATION_TIME_OUTPUT = document.getElementById("timeoutput") as HTMLTextAreaElement;
const USER_INPUT_FIRST_NAME_ONE = document.getElementById("firstnameone") as HTMLInputElement;
const USER_INPUT_LAST_NAME_ONE = document.getElementById("lastnameone") as HTMLInputElement;
const USER_INPUT_FIRST_NAME_TWO = document.getElementById("firstnametwo") as HTMLInputElement;
const USER_INPUT_LAST_NAME_TWO = document.getElementById("lastnametwo") as HTMLInputElement;
const DISPLAY_JUMPS = document.getElementById("jumps") as HTMLTextAreaElement;

console.log(DATA);

console.log("Initialized in " + (performance.now() - T_0) + " ms");

// Event listener for the Enter key. When pressed, will start the search process.
document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key == "Enter") {
    findJumps();
  }
}, false);

/**
 * Finds the number of steps required to get from one author to another by searching through their reference list.
 * @param first First name of the current author
 * @param last Last name of the current author
 * @param first2 First name of the target author
 * @param last2 Last name of the target author
 * @returns the number of steps required to get from the current author to the target author. Returns null if there is no valid path
 * Big Theta(2^n)
*/
function findReference(first: string, last: string, first2: string, last2: string): number {
  let stepCounter: number = 0;
  if (first == first2 && last == last2) {
    return stepCounter;
  }
  /* arrays to hold the current author's reference uids (children) */
  let uidArray: string[] = []; 
  let finalUidArray: string[] = [];
  /* array to store unique uids that have already been searched */
  let visited: string[] = []; 
  /* get the uids of the original and target authors based on their first and last names */
  let originalUID: string = DATA.guid[listReference(first, last, copyArray(DATA.firstName, false), DATA.lastName)];
  let targetUID: string = DATA.guid[listReference(first2, last2, copyArray(DATA.firstName, false), DATA.lastName)];
  uidArray[0] = originalUID;
  visited[0] = originalUID;

  while (originalUID != null) {
    finalUidArray = [];
    /* loops through the reference list, will loop max 10^i since there are 10 references for each author and will exponentially increase */
    for (let i = 0; i < Math.pow(10, stepCounter); i++) { 
      /* get first and last name using current uid */
      let name: string[] = uidSearch(uidArray[i]);  
      /* get the global index using the current first and last name */
      let currIndex: number = listReference(name[0], name[1], copyArray(DATA.firstName, false), DATA.lastName); 
      /* adds all of the reference uids of the current author to the finalUidArray */
      for (let a = 0; a < 10; a++) { 
        /* index (i*10) + a to get the starting index of each author's references and will need to increment by i for those 10 entries */
        finalUidArray[(i * 10) + a] = DATA.references[currIndex][a]; 
      }
      /** Adds any unique uid that haven't been visited to the visited array */
      for (let j = 0; j < finalUidArray.length; j++) {
        let alreadyFound: boolean = false;
        /** Check if current uid in the finalUidArray is already in the visited array */
        for (let v = 0; v < visited.length; v++) {
          if (visited[v] == finalUidArray[j]) {
            /** If the current uid is found in the visited aray, skips the entry */
            alreadyFound = true; 
            break;
          }
        }
        if (alreadyFound == false) {
          /** adds the current uid to the visited array if it has not be found yet */
          visited[visited.length] = finalUidArray[j]; 
        }
      }
    }
    /** Check for target author in the visited array */
    for (let k = 0; k < visited.length; k++) {
      if (visited[k] == targetUID) {
        /** returns number of steps if the target is found, plus one because the first jump is not counted */
        return stepCounter + 1; 
      }
    }
    /** Stops checking if the visited array exceeds or equals 100000 as it would have returned already if found in the last entry */
    if (visited.length >= 99999) {
      return -1;
    }
    stepCounter++;
    /** Set the uidArray to the final array to be used on the next loop */
    uidArray = [];
    uidArray = finalUidArray;
  }
  return -1;
}

/* 
 * Given a uid, it will find the first and last name of the author that is connected with the uid in an array
 * param uid uid of the author to find the first and last name of 
 * @returns an array of the first and last name of the author which is connected with the uid given
 *Big Theta(1)
*/
function uidSearch(uid: string): string[] {
  let array: string[] = [];

  let uidCopy: [[string, number]] = copyArray(DATA.guid, true);
  /** get the index of the uid */
  let target: number[] = binarySearch(uidCopy, uid);
  /** obtains the first name and last name of the author which is related to the uid given */
  array[0] = DATA.firstName[target[0]];
  array[1] = DATA.lastName[target[0]];
  return array;
}
/* 
 * Given a first and last name, find the index where these values are placed at in the original arrays
 * param firstName the first name of the author we are finding the index of
 * param lastName the last name of the author we are finding the index of
 * param firstArray the original array of the first name array
 * param lastArray the original array of the last name array
 * @returns a number which is the index of where the first and last names are in their respective original arrays
 *Big Theta(n)
*/
function listReference(firstName: string, lastName: string, firstArray: [[string, number]], lastArray: string[]): number {
  let sortArray: [[string, number]] = mergeSort(firstArray);
  let value: number = 0;
  /** get all the indexes of the people with the same first name */
  let binary: number[] = binarySearch(sortArray, firstName);
  for (let i = 0; i < binary.length; i++) {
    /** checks which index is equal to the same last name to get the unique persons index */
    if (lastArray[binary[i]] == lastName) {
      value = binary[i];
    }
  }
  return value;
}
/**
 * Sorting the target array by ascending order alphabetically, this is the first mergeSort function which uses 2d arrays. 
 * The first coloumn is the values that are used to sort by alphabetically and the second column are references which follow the value. 
 * The second function uses 1d arrays which only contain the references.
 * @param array the array we are going to be sorting by ascending
 * @returns the array that is now sorted by ascending
 * Big Theta(log n)
 */
function mergeSort(arr: [[string, number]]): [[string, number]] {
  if (arr.length <= 1) {
    return arr;
  }

  let mid = Math.floor(arr.length / 2);
  let left = JSON.parse(JSON.stringify(betterSlice(arr, 0, mid)));
  let right = JSON.parse(JSON.stringify(betterSlice(arr, mid))); 
  /* Sort the left side */
  left = mergeSort(left); 
  /* Sort the right side */
  right = mergeSort(right); 
  /* Merge the sorted left and right sides together to sort completely */
  return merge(left, right, arr); 
}
/*
 * Merging the left and right sides of the array to be sorted in accending order 
 * @param left the left side of the array we are sorting from to merge together
 * @param right right side of the array we are sorting from to merge together
 * @param array original array we are directly changing and sorting
 * @returns the original array that is now sorted by ascending
 * Big Theta(n)
*/
function merge(left: [[string, number]], right: [[string, number]], arr: [[string, number]]): [[string, number]] {
  /* Pointer to keep track of the left side */
  let i = 0; 
  /* Pointer to keep track of the right side */
  let j = 0; 
  for (let k = 0; k < arr.length; k++) {
    /* If left is empty */
    if (i >= left.length) {
      /* Dump in the values and their references from the right */
      arr[k][0] = right[j][0];
      arr[k][1] = right[j][1]; 
      j++;
    }
      /* If right is empty */
    else if (j >= right.length) {
      /* Dump in the values and references from the left */
      arr[k][0] = left[i][0]; 
      arr[k][1] = left[i][1]; 
      i++;
    }
      /** If the left value is smaller, add the current left value and reference to the array */
    else if (left[i][0] < right[j][0]) { 
      arr[k][0] = left[i][0];
      arr[k][1] = left[i][1];
      i++;
    }
      /* If its bigger, add the current right value and reference to the array */
    else { 
      arr[k][0] = right[j][0];
      arr[k][1] = right[j][1];
      j++;
    }
  }
  return arr;
}
/**
 * This is a replacement function for the built-in JS `Array.prototype.slice()` method. Not actually better than the built-in, is actually slower.
 * @param arr The array to slice
 * @param start The starting index
 * @param end The ending index. If no index is provided, the final index of `arr` will be used
 * @returns the sliced array
 * Big Theta(n)
 */
function betterSlice<T>(arr: T[], start: number, end?: number): T[] {
  /* If end is undefined, we go to the end of the array */
  if (end === undefined) {
    end = arr.length;
  }
  let result = new Array(end - start);
  let resultIndex = 0;
  for (let i = start; i < end; i++) {
    result[resultIndex] = arr[i];
    resultIndex++;
  }
  return result;
}

 /**
   * Creates a sorted deep copy of an array, and adds references of their index in the original array.
   * @param originalArray The array to copy
   * @param sortNeeded checks if the copy of the array needs to be sorted for useage of binary search or only copied
   * @returns A deep copy of `originalArray`, sorted or unsorted and with references to of their index to `originalArray`
  * Big Theta(n)
  */
function copyArray(originalArray: string[], sortNeeded: boolean): [[string, number]] {
  let arrayCopy: any = [];
  for (let i = 0; i < originalArray.length; i++) {
    /* copys the original array and adds the references in a 2d array */
    arrayCopy[i] = [originalArray[i], i]; 
  }
  if (sortNeeded) {
    /* sorts the copy of the array by ascending */
    mergeSort(arrayCopy); 
  }
  return arrayCopy;
}


/**
 * * Finds an item and its duplicates in a sorted 2d array of values and their referenced index to their spot in the original array
 * @param array The sorted array to search through
 * @param target The item we are looking for in the sorted 2d array
 * @returns An array of all of every found instance by their index inside their original array
 * @returns returns an empty number array if the item was not found in the 2d array
 * Big Theta(log n)
 */
function binarySearch(array: [[string, number]], target: string): number[] {
  let n = array.length;
  let left = 0;
  let right = n - 1;
  while (left <= right) {
    let middle = Math.floor((left + right) / 2);
    if (array[middle][0] < target) {
      /* if the target is bigger than the middle, move the left pointer to one past the middle */
      left = middle + 1;
    }
    else if (array[middle][0] > target) {
      /* if the target is smaller than the middle, move the right pointer to one below the middle */
      right = middle - 1;
    }
    else {
      /* if the target is found, we check for duplicates */
      return findDuplicates(middle, target, array);
    }
  }
  /* if the target is not in the array, we return an empty number array */ 
  return [];
}

/**
   * Finds all duplicates of the target object after atleast one instance was found
   * @param middleIndex the index where the target was found
   * @param target the target we are looking for in the array
   * @param array the sorted 2d array with the values and the  we are searching through to find the target
   * @returns An array of all found instances by only their indexes in the original arrays
   * Big Theta(n)
   */
function findDuplicates(middleIndex: number, target: string, arr: [[string, number]]): number[] {
  /* variable to save the targets index and check for duplicates in front of the index of the found target */
  let a: number = middleIndex;
  /* variable to keep track of the amount of duplicates */
  let i: number = 0; 
  let results: number[] = [];
  /* two while loops that checks the index of before and after the found target to check for duplicates */
  while (a < arr.length && arr[a][0] == target) {
    /* saves the reference of the duplicate to the results array */
    results[i] = arr[a][1]; 
    i++;
    a++;
  }
  /* variable to check for duplicates behind the index of the found target */
  let b = middleIndex - 1; 
  while (b >= 0 && arr[b][0] == target) {
    /* saves the reference of the duplicates to the results array */
    results[i] = arr[b][1]; 
    b--;
    i++;
  }
  return results;
}

/**
 * Displays the number of jumps it took to find the reference 
 * Big Theta(1)
 */
function findJumps() {

  const T0: number = performance.now();

  let jumps: number = findReference(USER_INPUT_FIRST_NAME_ONE.value, USER_INPUT_LAST_NAME_ONE.value, USER_INPUT_FIRST_NAME_TWO.value, USER_INPUT_LAST_NAME_TWO.value)

  DISPLAY_JUMPS.innerText = "Jumps: " + String(jumps);

  OPERATION_TIME_OUTPUT.innerText = "Sort took: " + (performance.now() - T0) + " ms";
}