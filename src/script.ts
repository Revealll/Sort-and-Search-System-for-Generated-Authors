namespace searchPage {
  /* Load, copy, and sort our data */
  const T_0 = performance.now();
  const DATA = loadJSON('../DO_NOT_TOUCH/data.json'); //Don't delete this line. All your data is here. It does take a few seconds for Replit to load the data because it's so large.
  const DATA_TITLE = copyArray(DATA.bookName, true);
  const DATA_GUID = copyArray(DATA.guid, true);
  const DATA_F_NAME = copyArray(DATA.firstName, true);
  const DATA_L_NAME = copyArray(DATA.lastName, true);
  const DATA_GENDER = gender(copyArray(DATA.gender, false), DATA.firstName);

  /** Get HTML elements */
  const OPERATION_TIME_OUTPUT = document.getElementById("timeoutput") as HTMLTextAreaElement;
  const USER_INPUT = document.getElementById("input") as HTMLInputElement;
  const SEARCH_FILTER = document.getElementById("filter") as HTMLSelectElement;
  const OUTPUT_TABLE = document.getElementById("table") as HTMLTableElement;
  const TABLE_BODY = document.getElementById("tablebody") as HTMLTableElement;
  const PREV_BUTTON = document.getElementById("prevbutton") as HTMLButtonElement;
  const NEXT_BUTTON = document.getElementById("nextbutton") as HTMLButtonElement;

  /** The searched results */
  let searchedResults: number[] = [];

  /** Table control variables */
  let currentIndex: number = 1;
  const ITEM_PER_PAGE: number = 8;
  let endIndex: number = 8

  console.log(DATA);

  console.log("Initialized in " + (performance.now() - T_0) + " ms");

  /** Event listener for the Enter key. When pressed, will start the search process. */
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key == "Enter") {
      search();
    }
  }, false);

  /**
   * Creates a map for the gender dataset. All 8 genders will be keys to an array of their referenced index in their original array.
   * Which then each array of references will be sorted by an additional similar array that is presorted and uses the reference
   * number as the index of said array to compare and sort the references alphabetically
   * @param arr The array to map
   * @param relatedArray the array of related data used for reference during the sorting process
   * @returns The mapped sorted version of `arr` 
   * Big Theta(n)
   */
  function gender(arr: [[string, number]], arr2: string[]) {
    /* Defining the map with the gender keys as a string and the referenced index as the number */
    interface Map { 
      [key: string]: number[]
    }
    /* the 8 keys that represent each gender */
    const map: Map = { 
      ["Male"]: [],
      ["Female"]: [],
      ["Agender"]: [],
      ["Polygender"]: [],
      ["Genderqueer"]: [],
      ["Bigender"]: [],
      ["Genderfluid"]: [],
      ["Non-binary"]: []
    };
    for (let i = 0; i < arr.length; i++) {
      const gender: string = arr[i][0];
      /* Adds the referenced index value to the corresponding gender key */
      map[gender][map[gender].length] = arr[i][1]; 
    }
    /** sorting the whole map by ascending in their seperate arrays */
    map.Male = mergeSortAscending(map.Male, arr2);
    map.Female = mergeSortAscending(map.Female, arr2);
    map.Agender = mergeSortAscending(map.Agender, arr2);
    map.Polygender = mergeSortAscending(map.Polygender, arr2);
    map.Genderqueer = mergeSortAscending(map.Genderqueer, arr2);
    map.Bigender = mergeSortAscending(map.Bigender, arr2);
    /* returns the sorted map */
    return map; 
  }

  /**
   * Search function. Searches through `DATA` for `USER_INPUT.value` with the `SEARCH_FILTER.value` filter.
   * Outputs the search results in `TABLE_BODY`, and outputs the search time in `OPERATION_TIME_OUTPUT.innerText`.
   * Resets all the variables used to display the 'TABLE_BODY' 
   * Check if the buttons should be disabled and unhides the table and buttons 
   * Big Theta(1)
   */
  export function search(): void {
    reset();

    console.log("Searching for \"" + USER_INPUT.value + "\" with the " + SEARCH_FILTER.value + " filter.");
    const T1: number = performance.now();
    switch (SEARCH_FILTER.value) {
      case "nofilter": {
        console.warn("No filter was specified. Aborting search.");
        return;
      }
      case "title": {
        searchedResults = binarySearch(DATA_TITLE, USER_INPUT.value);
        searchedResults = mergeSortAscending(searchedResults, DATA.firstName);
        break;
      }
      case "guid": {
        searchedResults = binarySearch(DATA_GUID, USER_INPUT.value);
        searchedResults = mergeSortAscending(searchedResults, DATA.firstName);
        break;
      }
      case "firstname": {
        searchedResults = binarySearch(DATA_F_NAME, USER_INPUT.value);
        searchedResults = mergeSortAscending(searchedResults, DATA.lastName);
        break;
      }
      case "lastname": {
        searchedResults = binarySearch(DATA_L_NAME, USER_INPUT.value);
        searchedResults = mergeSortAscending(searchedResults, DATA.firstName);
        break;
      }
      case "gender": {
        searchedResults = DATA_GENDER[USER_INPUT.value];
        break;
      }
    }
    if (searchedResults.length === 0) {
      console.info("Nothing found.");
      return;
    }
    OPERATION_TIME_OUTPUT.innerText = "Search took: " + String(performance.now() - T1) + " ms";
    OUTPUT_TABLE.hidden = false;
    NEXT_BUTTON.hidden = false;
    PREV_BUTTON.hidden = false;

    displayTable(searchedResults, currentIndex, ITEM_PER_PAGE);
    disableButtom();
  }

  /** 
   * Resets all the values used to count the index for displaying the 'TABLE_BODY'
   * Big Theta(1)
   */
  function reset(): void {
    currentIndex = 0;
    endIndex = 8;
  }

  /**
   * Finds an item and its duplicates in a sorted 2d array of values and their referenced index to their spot in the original array
   * @param array The sorted array to search through
   * @param target The item we are looking for in the sorted 2d array
   * @returns An array of all of every found instance by their index inside their original array
   * @returns returns an empty number array if the item was not found in the 2d array
   * Big O(log n)
   * Big Omega(1)
   */ 
  function binarySearch(array: [[string, number]], target: string,): number[] {
    let n: number = array.length;
    let left: number = 0;
    let right: number = n - 1;
    while (left <= right) {
      let mid: number = Math.floor((left + right) / 2);
      if (array[mid][0] < target) {
        /* if the target is bigger than the middle, move the left pointer to one past the middle */
        left = mid + 1; 
      } else if (array[mid][0] > target) {
        /* if the target is smaller than the middle, move the right pointer to one below the middle */
        right = mid - 1 
      } else {
        return findDuplicates(mid, target, array); 
      }
    }
    return []; 
  }

  /**
  * Finds an item in a sorted 2d array.
  * This is basically binary search but changed to act as a replacment for the built-in `Array.prototpye.indexOf()` method
  * @param arr The sorted array to search through
  * @param target The item we are looking for in the sorted 2d array
  * @returns The index of `target` in `arr`, `null` if `target` was not found
  * Big O(log n)
  * Big Omega(1)
  */
  function reference(arr: [[string, number]], target: string): number | null {
    let n: number = arr.length;
    let left: number = 0;
    let right: number = n - 1;
    while (left <= right) {
      let midPoint: number = Math.floor((left + right) / 2);
      if (arr[midPoint][0] < target) {
        left = midPoint + 1;
      } else if (arr[midPoint][0] > target) {
        right = midPoint - 1
      } else {
        return arr[midPoint][1];
      }
    }
    return null;
  }

  /**
   * Finds all duplicates of the target object after atleast one instance was found
   * @param middleIndex the index where the target was found
   * @param target the target we are looking for in the array
   * @param array the sorted 2d array with the values and the  we are searching through to find the target
   * @returns An array of all found instances by only their indexes in the original arrays
   * Big Theta(n)
   */
  function findDuplicates (middleIndex: number, target: string, array: [[string, number]]): number[] {
    /* variable to save the targets index and check for duplicates in front of the index of the found target */
    let a: number = middleIndex; 
    /* variable to keep track of the amount of duplicates */
    let i = 0; 
    let results: number[] = [];
    /* two while loops that checks the index of before and after the found target to check for duplicates */
    while (a < array.length && array[a][0] == target) {
      /* saves the reference of the duplicate to the results array */
      results[i] = array[a][1]; 
      i++
      a++
    }
    /* variable to check for duplicates behind the index of the found target */
    let b: number = middleIndex - 1; 
    while (b >= 0 &&array[b][0] == target) {
      /* saves the reference of the duplicates to the results array */
      results[i] = array[b][1]; 
      b--;
      i++;
    }
    return results;
  }

  /**
   * This is a replacement function for the built-in JS `Array.prototype.slice()` method. Not actually better than the built-in, is actually slower.
   * @param arr The array to slice
   * @param start The starting index
   * @param [end] The ending index. If no index is provided, the final index of `arr` will be used
   * @returns A shallow copy of the specified portion of `arr`
   * Big Theta(n)
  */
  function betterSlice<T>(arr: any[], start: number, end?: number): T[] {
    /* If end is undefined, we go to the end of the array */
    if (end === undefined) {
      end = arr.length;
    }
    let result: T[] = new Array(end - start);
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
  function copyArray<T>(originalArray: T[], sortNeeded: boolean): [[string, number]] {
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

    let mid: number = Math.floor(arr.length / 2); 
    let left: [[string, number]] = JSON.parse(JSON.stringify(betterSlice(arr, 0, mid)));
    let right: [[string, number]] = JSON.parse(JSON.stringify(betterSlice(arr, mid))); 
    /* Sort the left side */
    left = mergeSort(left); 
    /* Sort the right side */
    right = mergeSort(right); 
    /* Merge the sorted left and right sides together to sort completely */
    return merge(left, right, arr); 
  }

  /**
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
        arr[k][0] = right[j][0];
        /* Dump in the values from the right */
        arr[k][1] = right[j][1]; 
        j++;
        /* If right is empty */
      } else if (j >= right.length) {
        /* Dump in the values from the left */
        arr[k][0] = left[i][0];
        /* Dump in the references from the left */
        arr[k][1] = left[i][1]; 
        i++;
        /* If the left value is smaller, add the current left value and reference to the array */
      } else if (left[i][0] < right[j][0]) {
        arr[k][0] = left[i][0];
        arr[k][1] = left[i][1];
        i++;
        /* If its bigger, add the current right value and reference to the array */
      } else {
        arr[k][0] = right[j][0];
        arr[k][1] = right[j][1];
        j++;
      }
    }
    return arr;
  }

  /**
   * Displays the results of `search()` in a HTML Table
   * @param results An array of results to display. Must contain references to the original `DATA` arrays
   * @param start of the range of the results to display
   * @param end of the range of results to display
   * Big Theta(n)
   */
  function displayTable(results: number[], start: number, end: number): void {
    TABLE_BODY.innerHTML = "";

    if (currentIndex + ITEM_PER_PAGE > results.length) {
      end = results.length;
    }

    for (let i = start; i < end; i++) {
      let row = TABLE_BODY.insertRow();
      let temp: number = results[i];

      let uidCell = row.insertCell(0);
      let titleCell = row.insertCell(1);
      let firstNameCell = row.insertCell(2);
      let lastNameCell = row.insertCell(3);
      let genderCell = row.insertCell(4);
      let referenceCell = row.insertCell(5);

      uidCell.innerHTML = DATA.guid[temp];
      titleCell.innerHTML = DATA.bookName[temp];
      firstNameCell.innerHTML = DATA.firstName[temp];
      lastNameCell.innerHTML = DATA.lastName[temp];
      genderCell.innerHTML = DATA.gender[temp];
      for (let j = 0; j < 10; j++) {
        referenceCell.innerHTML += DATA.references[temp][j] + " | " + (DATA.lastName[reference(DATA_GUID, DATA.references[temp][j])]) + ", " + (DATA.firstName[reference(DATA_GUID, DATA.references[temp][j])]) + "\n";
      }
    }
  }

  /** 
   * This function is used to disable and enable the next and previous buttons based on what page the user is on
   *Big Theta(1)
   */
  export function disableButtom(): void {
    if (currentIndex <= 0) {
      PREV_BUTTON.disabled = true;
    } else {
      PREV_BUTTON.disabled = false;
    }
    if (currentIndex + ITEM_PER_PAGE > searchedResults.length) {
      NEXT_BUTTON.disabled = true;
    } else {
      NEXT_BUTTON.disabled = false;
    }
  }

  /**
   * Displays the next 8 elements that were searched and display it in the `TABLE_BODY`
   * Big Theta(1)
   */
  export function nextButton(): void {
    currentIndex = currentIndex + ITEM_PER_PAGE;
    if (currentIndex + ITEM_PER_PAGE > searchedResults.length) { /** If the next set of 8 indexs to show is greater than the total searhced results it will only display the remaining indexs */
      endIndex = searchedResults.length;
    } else {
      endIndex += ITEM_PER_PAGE;
    }
    disableButtom();
    displayTable(searchedResults, currentIndex, endIndex);
  }

  /**
   * Displays the previous 8 elements that were searched and display it in the `TABLE_BODY`
   * Big Theta(1)
   */
  export function prevButton(): void {
    if (endIndex >= searchedResults.length) { /** If the last index is the same or grater than the length of the searched array there will be the remaining results showed, it will go back by the remaining results */
      endIndex = searchedResults.length - (searchedResults.length - currentIndex);
    } else {
      endIndex -= ITEM_PER_PAGE;
    }
    currentIndex = currentIndex - ITEM_PER_PAGE;
    disableButtom();
    displayTable(searchedResults, currentIndex, endIndex);
  }

  /**
   * Sorts the array of references in ascending order, it uses an additional similar array that is presorted and uses the reference
   * number as the index of said array to compare and sort the references alphabetically
   * @param results the array of reference numbers that needs to be assorted by ascending order
   * @param relatedArray the array of related data used for reference during the sorting process
   * @returns the original array that is now sorted in ascending order 
   * Big Theta(log n)
   */
  function mergeSortAscending(results: number[], relatedArray: string[]): number[] {
    if (results.length <= 1) {
      return results;
    }
    /* It doesn't really matter if it is floor or ceil here. */
    let mid: number = Math.floor(results.length / 2);
    /* sort the left side */
    let left: number[] = JSON.parse(JSON.stringify(betterSlice(results, 0, mid))); 
    /* sort the right side */
    let right: number[] = JSON.parse(JSON.stringify(betterSlice(results, mid))); 
    left = mergeSortAscending(left, relatedArray);
    right = mergeSortAscending(right, relatedArray);
    /* Merge the sorted left and right sides to sort completely */
    return mergeAscending(left, right, results, relatedArray); 
  }

  /**
   * Merging the left and right sides of the array to be sorted in accending order 
   * @param left the left side of the array we are sorting from to merge together
   * @param right the right side of the array we are sorting from to merge together
   * @param results the original results array we are directly changing and sorting
   * @param relatedArray the similar array with the values to be used to sort the reference array
   * @returns the original array that is now sorted by ascending by references 
   * Big Theta(n)
   */
  function mergeAscending(left: number[], right: number[], arr: number[], arr2: string[]): number[] {
    /* pointer to keep track of the left side */
    let i = 0;
    /* pointer to keep track of the right side */
    let j = 0; 
    for (let k = 0; k < arr.length; k++) {
      /* if left is empty */
      if (i >= left.length) {
        /* Dump in the references from the right if the left array is used up */
        arr[k] = right[j]; 
        j++;
        /* If right is empty */
      } else if (j >= right.length) {
        /* Dump in the references from the right */
        arr[k] = left[i]; 
        i++;
      } else if (arr2[left[i]] < arr2[right[j]]) {
        /* Compares the related array of using the references and if the left is smaller than the right, 
         *  adds the left reference to the array
         */
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        /* If it is bigger, add the right reference to the array */
        j++;
      }
    }
    return arr;
  }
}

(window as any).search = searchPage.search;
(window as any).nextButton = searchPage.nextButton;
(window as any).prevButton = searchPage.prevButton;

