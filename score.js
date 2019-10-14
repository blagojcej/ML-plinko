const outputs = [];
const predictionPoint = 300;
const k = 3;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket

  outputs.push([dropPosition, bounciness, size, bucketLabel]);

  // console.log(outputs);
}

function runAnalysis() {
  // Write code here to analyze stuff

  const bucket = _.chain(outputs)
    // Subsctract by 300 using distance function and map result as first element with bucket number as second element
    .map(row => [distance(row[0]), row[3]])
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

  console.log('Your point will probably fall into ', bucket);
}

function distance(point) {
  return Math.abs(point - predictionPoint);
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