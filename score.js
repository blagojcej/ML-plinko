/**
 * Summary:
 * 1. calculation distance between multiple parameters - Pythagorean theorem: C=(A ** 2 + B ** 2 ... + [N ** 2]) ** 0.5
 * 2. ball bouncines is not affecting on knn results - in reality bouncines decimal values are close each other. 
 *    - Reference: Course: Udemy - Machine Learning with Javascript, Chapter: Algorithm Overview, Lesson: Magnitude Offsets in Features & Lesson: Feature Selection with KNN
 * 3. normalizing dataset - Normalizing one feature at the time, min-max method. Equation: NormalizedDataSet=(FeatureValue-minOfFeatureValues)/(maxOfFeatureValues-minOfFeatureValues)
 */

const outputs = [];
// const predictionPoint = 300;
// const k = 3;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket

  outputs.push([dropPosition, bounciness, size, bucketLabel]);

  // console.log(outputs);
}

function runAnalysis() {
  // Write code here to analyze stuff

  // The bigger test set is, the lower accuracy result we've got
  // const testSetSize = 10;
  const testSetSize = 100;
  const k = 10;

  // Make test for 10 random separete points
  // Not nomralized dataset
  // const [testSet, trainingSet] = splitDataset(outputs, testSetSize);
  // Normalized dataset, get frist 3 columns, 4th columns is label (bucket number)
  const [testSet, trainingSet] = splitDataset(minMax(outputs, 3), testSetSize);

  /*
  let numberCorrect = 0;
  // Iterate over everything inside testSet and use trainingSet and KNN function to make prediction
  for (let i = 0; i < testSet.length; i++) {
    // testSet[i][0] gives first element in array
    const bucket = knn(trainingSet, testSet[i][0]);

    // Log the bucket number 3rd element in testSet
    // console.log(bucket, testSet[i][3]);

    // Count correct values
    if (bucket === testSet[i][3]) {
      numberCorrect++;
    }
  } 
  // const bucket = knn(outputs);
  // console.log('Your point will probably fall into ', bucket);
  console.log('Accuracy: ', numberCorrect / testSetSize);
  */

  // k is 20
  // for optimal k result we choose average value from result
  // Refactoring for loop
  // feature ===0 - first element in array, feature === 1 - second element in array, feature === 2 - third element in array
  _.range(0, 3).forEach(feature => {
    const accuracy = _.chain(testSet)
      // Get all records match criteria
      // .filter(testPoint => knn(trainingSet, testPoint[0], k) === testPoint[3])
      // Putting initial on point parameter because we don't want to add last element (bucket number) of testing dataset      
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === testPoint[3])
      // Count filtered records
      .size()
      // Calculate percentage
      .divide(testSetSize)
      .value();

    console.log('For k of ', k, ' accuracy is: ', accuracy);
  });
}

/**
 * Function which run KNN algorithm to analyze given data and predict most common result
 * IMPORTANT: Point parametar has to have 3 values!!!
 * 
 * @param {Array} dataset Dataset for training or analysis
 * @param {integer} point Distance point 
 * @param {integer} k Top k elements 
 */
function knn(dataset, point, k) {
  return _.chain(dataset)
    // Subsctract by point using distance function and map result as first element with bucket number as second element
    // .map(row => [distance(row[0], point), row[3]])
    // Work with as many parameters as we want
    .map(row => {
      return [
        // Putting initial on point parameter because we don't want to add last element (bucket number) of testing dataset
        // distance(_.initial(row), _.initial(point)),
        distance(_.initial(row), point),
        _.last(row)
      ]
    })
    // After getting/maping sort distance results from least to greatest
    .sortBy(row => row[0])
    // Take top three elements
    .slice(0, k)
    // Count most common output/label grouping by bucket number as key, values would be unique elements grouped by bucket number
    .countBy(row => row[1])
    // Convert grouped elements to array
    .toPairs()
    // Sort by second element as sorting criteria, the bucket showing most commonly will end up at the end of array
    .sortBy(row => row[1])
    // Get most commonly array, last element after sorting
    .last()
    // Get first element of last array, which is bucket number
    .first()
    // Convert bucket number to integer
    .parseInt()
    // Get the value
    .value()
}

// Work with as many parameters as we want
function distance(pointA, pointB) {
  // Work with two parameters
  // pointA=300, pointB=350
  // return Math.abs(pointA - pointB);

  // pointA=[300,.5,19], pointB=[350,.55,16]
  return _.chain(pointA)
    // Match every index of every array with other arrays ex. [[300,350],[.5,.55],[19,16]]
    .zip(pointB)
    // .map(pair => (pair[0] - pair[1]))
    // ES6 sintax (**) - square sign
    .map(([a, b]) => (a - b) ** 2)
    // Sum them all up
    .sum()
    // Get the value/result
    // Square the root
    .value() ** 0.5;
}

/**
 * Split training set of data from test set data
 * 
 * @param {Array} data Training data set
 * @param {integer} testCount How many records take out of dataset and put into test set, remaining will stay into training dataset 
 * 
 * @returns {Array} first parameter is test set, second parameter is training data set
 */
function splitDataset(data, testCount) {
  // Shuffle training data
  const shuffled = _.shuffle(data);

  // Separate test set and training set
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}

/**
 * Function which return normalized values between 0 and 1 from array(s) of values
 * 
 * @param {Array} data array of data to be normalized
 * @param {integer} featureCount How many columns of array data we want to normalize
 */
function minMax(data, featureCount) {
  // Clone data array, because we don;t want to modify original data variable/parameter
  const clonedData = _.cloneDeep(data);

  //Normalize clonedData for each element in array
  for (let i = 0; i < featureCount; i++) {
    // Extract column which we'll normalize (array of numbers)
    const column = clonedData.map(row => row[i]);

    // Extract min and max values
    const min = _.min(column);
    const max = _.max(column);

    // Loop through each array, and get value from "i" element
    for (let j = 0; j < clonedData.length; j++) {
      // Calculate normalized value
      // See reference at the beginning of the document (3)
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
    }
  }

  return clonedData;
}