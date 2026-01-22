namespace tablePage {
  /* Load, copy, and sort our data */
  const T_0: number = performance.now();
  const DATA = loadJSON('../DO_NOT_TOUCH/data.json');
  const DATA_TITLE = copyArray(DATA.bookName, true);
  const DATA_GUID = copyArray(DATA.guid, true);
  const DATA_F_NAME = copyArray(DATA.firstName, true);
  const DATA_L_NAME = copyArray(DATA.lastName, true);
  const DATA_GENDER = copyArray(DATA.gender, true);
  console.log(DATA_TITLE);

  /** Get HTML elements */
  const SORT_CATAGORY = document.getElementById("category") as HTMLSelectElement;
  const SORT_ORDER = document.getElementById("order") as HTMLSelectElement;
  const OUTPUT_TABLE = document.getElementById("table") as HTMLTableElement;
  const OUTPUT_TABLE_BODY = document.getElementById("tablebody") as HTMLTableElement;
  const NEXT_BUTTON = document.getElementById("nextbutton") as HTMLButtonElement;
  const PREV_BUTTON = document.getElementById("prevbutton") as HTMLButtonElement;
  const OPERATION_TIME_OUTPUT = document.getElementById("timeoutput") as HTMLTextAreaElement;

  /** Table control variables */
  const ITEMS_PER_PAGE: number = 8;
  let currentIndex: number = 0;
  let datasetBeingDisplayed: [[string, number]];
  let endIndex: number = 8;

  console.log(DATA);

  /** Event listener for the Enter key. When pressed, will start the search process. */
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key == "Enter") {
      sort();
    }
  }, false);

  console.log("Initialized in " + (performance.now() - T_0) + "ms");

   /**
   * 
   * 
   * 
   * 
   * Big Theta(1)
   */
  export function sort(): void {
    reset();

    const T_0: number = performance.now();

    if (SORT_ORDER.value === "noorder") {
      console.warn("No order was specified. Aborting.");
      return;
    }

    switch (SORT_CATAGORY.value) {
      case "nocategory": {
        console.warn("No sort category was specified. Aborting.");
        return;
      }
      case "title": {
        displayTable(currentIndex, ITEMS_PER_PAGE, DATA_TITLE);
        datasetBeingDisplayed = DATA_TITLE;
        break;
      }
      case "uid": {
        displayTable(currentIndex, ITEMS_PER_PAGE, DATA_GUID);
        datasetBeingDisplayed = DATA_GUID;
        break;
      }
      case "firstname": {
        displayTable(currentIndex, ITEMS_PER_PAGE, DATA_F_NAME);
        datasetBeingDisplayed = DATA_F_NAME;
        break;
      }
      case "lastname": {
        displayTable(currentIndex, ITEMS_PER_PAGE, DATA_L_NAME);
        datasetBeingDisplayed = DATA_L_NAME;
        break;
      }
      case "gender": {
        displayTable(currentIndex, ITEMS_PER_PAGE, DATA_GENDER);
        datasetBeingDisplayed = DATA_GENDER;
        break;
      }
    }

    disableButton();

    OPERATION_TIME_OUTPUT.innerText = "Sort took: " + (performance.now() - T_0) + "ms";

    OUTPUT_TABLE.hidden = false;
    NEXT_BUTTON.hidden = false;
    PREV_BUTTON.hidden = false;
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
   * This is a replacement function for the built-in JS `Array.prototype.slice()` method. Not actually better than the built-in, is actually slower.
   * @param arr The array to slice
   * @param start The starting index
   * @param [end] The ending index. If no index is provided, the final index of `arr` will be used
   * @returns A shallow copy of the specified portion of `arr`
   * Big Theta(n)
  */
  function betterSlice<T>(arr: any[], start: number, end?: number): T[] {
    // If end is undefined, we go to the end of the array
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
      arrayCopy[i] = [originalArray[i], i]; // copys the original array and adds the references in a 2d array
    }
    if (sortNeeded) {
      mergeSort(arrayCopy); // sorts the copy of the array by ascending
    }
    return arrayCopy;
  }

  /**
   * Sorting the target array by ascending order alphabetically, this is the first mergeSort function which uses 2d arrays, the first coloumn is the values that are used to sort by alphabetically and the second column are references which follow the value, the second function uses 1d arrays which only contain the references
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
    let right: [[string, number]] = JSON.parse(JSON.stringify(betterSlice(arr, mid))); //Second half
    left = mergeSort(left); // sort the left side
    right = mergeSort(right); // sort the right side

    return merge(left, right, arr); // merge the sorted left and right sides together to sort completely 
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
    let i = 0; // pointer to keep track of the left side
    let j = 0; // pointer to keep track of the right side
    for (let k = 0; k < arr.length; k++) {
      if (i >= left.length) {
        //If left is empty
        arr[k][0] = right[j][0];
        arr[k][1] = right[j][1]; //Dump in the values from right
        j++;
      } else if (j >= right.length) {
        //If right is empty
        arr[k][0] = left[i][0]; // Dump in the values from the left
        arr[k][1] = left[i][1]; //Dump in the references from the left
        i++;
      } else if (left[i][0] < right[j][0]) { // If the left value is smaller, add the current left value and reference to the array
        arr[k][0] = left[i][0];
        arr[k][1] = left[i][1];
        i++;
      } else { // If its bigger, add the current right value and reference to the array
        arr[k][0] = right[j][0];
        arr[k][1] = right[j][1];
        j++;
      }
    }
    return arr;
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
  function binarySearch(arr: [[string, number]], target: string): number | null {
    let n: number = arr.length;
    let left: number = 0;
    let right: number = n - 1;
    while (left <= right) {
      let m: number = Math.floor((left + right) / 2);
      if (arr[m][0] < target) {
        left = m + 1;
      } else if (arr[m][0] > target) {
        right = m - 1
      } else {
        return arr[m][1];
      }
    }
    return null;
  }

  /**
   * Displays the results of `search()` in a HTML Table
   * @param results An array of results to display. Must contain references to the original `DATA` arrays
   * @param start of the range of the results to display
   * @param end of the range of results to display
   * Big Theta(n)
   */
  function displayTable(start: number, end: number, category: [[string, number]]): void {
    OUTPUT_TABLE_BODY.innerHTML = "";

    if (SORT_ORDER.value === "increase") {
      for (let i = start; i < end; i++) {
        let row = OUTPUT_TABLE_BODY.insertRow();
        let temp: number = category[i][1];

        let uidCell = row.insertCell(0);
        let titleCell = row.insertCell(1);
        let firstNameCell = row.insertCell(2);
        let lastNameCell = row.insertCell(3);
        let genderCell = row.insertCell(4);
        let referenceCell = row.insertCell(5);

        uidCell.innerText = DATA.guid[temp];
        titleCell.innerText = DATA.bookName[temp];
        firstNameCell.innerText = DATA.firstName[temp];
        lastNameCell.innerText = DATA.lastName[temp];
        genderCell.innerText = DATA.gender[temp];
        for (let j = 0; j < 10; j++) {
          referenceCell.innerText += DATA.references[temp][j] + " | " + (DATA.lastName[binarySearch(DATA_GUID, DATA.references[temp][j])]) + ", " + (DATA.firstName[binarySearch(DATA_GUID, DATA.references[temp][j])]) + "\n ";
        }
      }
    } else {
      start = (DATA_F_NAME.length - 1) - (8 * (currentIndex / 8));
      console.log(currentIndex / 8);
      end = start - 8;
      for (let i = start; i > end; i--) {
        let row = OUTPUT_TABLE_BODY.insertRow();
        let temp: number = category[i][1];
        console.log(i);

        let uidCell = row.insertCell(0);
        let titleCell = row.insertCell(1);
        let firstNameCell = row.insertCell(2);
        let lastNameCell = row.insertCell(3);
        let genderCell = row.insertCell(4);
        let referenceCell = row.insertCell(5);

        uidCell.innerText = DATA.guid[temp];
        titleCell.innerText = DATA.bookName[temp];
        firstNameCell.innerText = DATA.firstName[temp];
        lastNameCell.innerText = DATA.lastName[temp];
        genderCell.innerText = DATA.gender[temp];
        for (let j = 0; j < 10; j++) {
          referenceCell.innerText += DATA.references[temp][j] + " | " + (DATA.lastName[binarySearch(DATA_GUID, DATA.references[temp][j])]) + ", " + (DATA.firstName[binarySearch(DATA_GUID, DATA.references[temp][j])]) + "\n ";
        }
      }
    }
  }

  /** 
  * This function is used to disable and enable the next and previous buttons based on what page the user is on
  * Big Theta(1)
  */
  function disableButton(): void {
    if (currentIndex <= 0) {
      PREV_BUTTON.disabled = true;
    } else {
      PREV_BUTTON.disabled = false;
    }

    if (currentIndex + ITEMS_PER_PAGE > datasetBeingDisplayed.length) {
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
    currentIndex = currentIndex + ITEMS_PER_PAGE;

    if (currentIndex + ITEMS_PER_PAGE > datasetBeingDisplayed.length) { /** If the next set of 8 indexs to show is greater than the total searhced results it will only display the remaining indexs */
      endIndex = datasetBeingDisplayed.length;
    } else {
      endIndex += ITEMS_PER_PAGE;
    }
    disableButton();

    displayTable(currentIndex, endIndex, datasetBeingDisplayed);
  }

  /**
  * Displays the previous 8 elements that were searched and display it in the `TABLE_BODY`
  * Big Theta(1)
  */
  export function prevButton(): void {
    if (endIndex >= datasetBeingDisplayed.length) { /** If the last index is the same or grater than the length of the searched array there will be the remaining results showed, it will go back by the remaining results */
      endIndex = datasetBeingDisplayed.length - (datasetBeingDisplayed.length - currentIndex);
    } else {
      endIndex -= ITEMS_PER_PAGE;
    }

    currentIndex = currentIndex - ITEMS_PER_PAGE;

    disableButton();

    displayTable(currentIndex, endIndex, datasetBeingDisplayed);
  }
}

(window as any).sort = tablePage.sort;
(window as any).nextButton = tablePage.nextButton;
(window as any).prevButton = tablePage.prevButton;
