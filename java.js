function solve(matrix1, matrixResult) {
  var n = matrixResult.length;

  for (var i = 0; i < n; i++) {
    var max = i;
    for (var j = i + 1; j < n; j++) {
      if (Math.abs(matrix1[j][i]) > Math.abs(matrix1[max][i])) {
        max = j;
      }
    }
    const audio = new Audio('gode.mp3');
  audio.play();

    var temp1 = matrix1[i];
    matrix1[i] = matrix1[max];
    matrix1[max] = temp1;

    var temp2 = matrixResult[i];
    matrixResult[i] = matrixResult[max];
    matrixResult[max] = temp2;

    for (var j = i + 1; j < n; j++) {
      var x = matrix1[j][i] / matrix1[i][i];
      matrixResult[j] = matrixResult[j] - x * matrixResult[i];
      for (var k = i; k < n; k++) {
        matrix1[j][k] = matrix1[j][k] - x * matrix1[i][k];
      }
    }
  }

  if (matrix1[n - 1][n - 1] == 0) {
    if (matrixResult[n - 1] != 0) {
      throw new Error("Equation is inconsistent, equation is unsolvable");
    } else {
      throw new Error("Equation has infinite solutions");
    }
  } else {
    var solution = new Array(n);
    for (var i = n - 1; i >= 0; i--) {
      var sum = 0;
      for (var j = i + 1; j < n; j++) {
        sum = sum + matrix1[i][j] * solution[j];
      }
      solution[i] = (matrixResult[i] - sum) / matrix1[i][i];
    }
    matrixResult = solution;
  }

  return matrixResult;
}

function invMatrix(matrix, n) {
  let matrixInv = [];

  // Initialize the matrixInv array
  for (let i = 0; i < n; i++) {
    matrixInv[i] = [];
    for (let j = 0; j < 2 * n; j++) {
      if (j === i + n) {
        matrixInv[i][j] = 1;
      } else if (j < n) {
        matrixInv[i][j] = matrix[i][j];
      } else {
        matrixInv[i][j] = 0;
      }
    }
  }

  // Perform row operations to obtain the inverse matrix
  for (let i = 0; i < n; i++) {
    let temp = matrixInv[i][i];
    for (let j = 0; j < 2 * n; j++) {
      matrixInv[i][j] = matrixInv[i][j] / temp;
    }
    for (let j = 0; j < n; j++) {
      if (j !== i) {
        temp = matrixInv[j][i] / matrixInv[i][i];
        for (let k = 0; k < 2 * n; k++) {
          matrixInv[j][k] = matrixInv[j][k] - matrixInv[i][k] * temp;
        }
      }
    }
  }

  // Extract the inverse matrix from the result
  let inverseMatrix = [];
  for (let i = 0; i < n; i++) {
    inverseMatrix[i] = matrixInv[i].slice(n);
  }

  return inverseMatrix;
}

function displayOutput(solution, matrix, matrixInv) {
  const outputContainer = document.getElementById('output-container');
  outputContainer.textContent = '';

  for (let i = 0; i < solution.length; i++) {
    const solutionText = document.createTextNode(`Solution for x${i + 1} is: ${solution[i].toFixed(4)}`);
    const solutionDiv = document.createElement('div');
    solutionDiv.appendChild(solutionText);
    outputContainer.appendChild(solutionDiv);
  }

  const equationText = document.createTextNode('\nEquation matrices:');
  outputContainer.appendChild(equationText);
  outputContainer.appendChild(document.createElement('br'));

  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i].map(value => value.toFixed(4)).join('\t');
    const rowText = document.createTextNode(row);
    const rowDiv = document.createElement('div');
    rowDiv.appendChild(rowText);
    outputContainer.appendChild(rowDiv);
  }

  outputContainer.appendChild(document.createElement('br'));

  const inverseText = document.createTextNode('Inverse matrix:');
  outputContainer.appendChild(inverseText);
  outputContainer.appendChild(document.createElement('br'));

  for (let i = 0; i < matrixInv.length; i++) {
    const row = matrixInv[i].map(value => value.toFixed(4)).join('\t');
    const rowText = document.createTextNode(row);
    const rowDiv = document.createElement('div');
    rowDiv.appendChild(rowText);
    outputContainer.appendChild(rowDiv);
  }

  document.getElementById('output-section').classList.remove('hidden');
}

document.getElementById('submit-btn').addEventListener('click', function () {
  const n = parseInt(document.getElementById('variables').value, 10);
  const solution = new Array(n);
  const matrix = new Array(n);
  const matrix2 = new Array(n);
  const matrixInv = new Array(n);

  for (let i = 0; i < n; i++) {
    matrix[i] = new Array(n);
    matrix2[i] = new Array(n);
    matrixInv[i] = new Array(n);
  }

  

  const coefficients = prompt(`Enter ${n * n} coefficients (space as delimiter):`).trim().split(' ');

  for (let i = 0, k = 0; i < n; i++) {
    for (let j = 0; j < n; j++, k++) {
      matrix[i][j] = parseFloat(coefficients[k]);
      matrix2[i][j] = parseFloat(coefficients[k]);
    }
  }

  console.log('Equation matrices:');
  for (let i = 0; i < n; i++) {
    console.log(matrix[i].map(value => value.toFixed(4)).join('\t'));
  }

  const solutions = prompt(`Enter ${n} solutions (space as delimiter):`).trim().split(' ');

  for (let i = 0; i < n; i++) {
    solution[i] = parseFloat(solutions[i]);
  }

  const finalSolution = solve(matrix, solution);
  const inverseMatrix = invMatrix(matrix2, n);

  displayOutput(finalSolution, matrix, inverseMatrix);
});
