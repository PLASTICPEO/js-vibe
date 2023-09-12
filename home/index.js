const easyButton = document.getElementById("easy");
const mediumButton = document.getElementById("medium");
const difficultButton = document.getElementById("difficult");
const choosenWindow = document.getElementById("difficulty");
const gameBoard = document.getElementById("board");
const scoreDisplay = document.getElementById("score");
const pointDisplay = document.getElementById("point");
const messageDisplay = document.getElementById("game-message"); // Add a message display element

let currentLevel = "";
let score = 3;
let point = 0;
let gameDifficulty = "";

easyButton.addEventListener("click", () => startGame("easy"));
mediumButton.addEventListener("click", () => startGame("medium"));
difficultButton.addEventListener("click", () => startGame("difficult"));

const hideColors = () => {
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item) => {
    item.style.backgroundColor = "gray"; // Hide colors
  });
};

const showColorsForDuration = (duration) => {
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item) => {
    item.style.backgroundColor = item.dataset.color; // Show color
  });

  // Hide colors after the specified duration
  setTimeout(() => {
    hideColors();
  }, duration);
};

const startGame = (level) => {
  scoreDisplay.textContent = `Score: ${score}`;
  pointDisplay.textContent = `Score: ${point}`;
  currentLevel = level;
  let elementCount = 0;
  let colorPairs = [];

  let elementShowDuration = 0;

  if (level === "easy") {
    elementCount = 6;
    elementShowDuration = 2000;
    gameDifficulty = "easy";
  } else if (level === "medium") {
    elementCount = 10;
    elementShowDuration = 3000;
    gameDifficulty = "medium";
  } else {
    elementShowDuration = 5000;
    elementCount = 20;
    gameDifficulty = "difficult";
  }

  // Generate random colors for the grid
  for (let i = 0; i < elementCount / 2; i++) {
    const randomColor = generateRandomColor();
    colorPairs.push(randomColor, randomColor); // Add two identical colors
  }

  colorPairs = shuffleArray(colorPairs); // Shuffle the color pairs

  gameBoard.innerHTML = ""; // Clear the game board

  for (let i = 0; i < elementCount; i++) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");

    // Assign colors from the shuffled array and store them in a data attribute
    gridItem.dataset.color = colorPairs[i];
    gridItem.style.backgroundColor = "gray"; // Initially hide colors

    gridItem.addEventListener("click", () => {
      handleGridItemClick(gridItem);
    });

    gameBoard.appendChild(gridItem);
  }

  choosenWindow.style.display = "none";

  // Show colors for 2 seconds at the start of the game

  showColorsForDuration(elementShowDuration);
};

let firstClickedItem = null;

// Add a variable to keep track of the remaining open elements
let remainingOpenElements = 0;

// Modify the handleGridItemClick function
function handleGridItemClick(item) {
  const wrong = new Audio("./assets/sounds/wrong.wav");
  const right = new Audio("./assets/sounds/right.wav");
  const loose = new Audio("./assets/sounds/loose.wav");
  const won = new Audio("./assets/sounds/won.wav");

  if (remainingOpenElements >= 2 || item.style.backgroundColor !== "gray") {
    return; // Limit the number of open elements
  }

  item.style.backgroundColor = item.dataset.color; // Show color
  remainingOpenElements++;

  if (!firstClickedItem) {
    firstClickedItem = item;
  } else if (firstClickedItem !== item) {
    if (firstClickedItem.style.backgroundColor === item.style.backgroundColor) {
      // Colors match, keep the elements visible
      firstClickedItem = null;
      remainingOpenElements = 0;
      point += 2.5;
      scoreDisplay.textContent = `Score: ${score}`;
      pointDisplay.textContent = `Score: ${point}`;

      right.play();
      // Check if all elements are visible
      if (areAllElementsVisible()) {
        choosenWindow.style.display = "flex";
        messageDisplay.innerText = "You're welcome! \u{1F44D}";
        won.play();
        messageDisplay.style.color = "#6F9CEB";
        score = 3;
        point = 0;
      }
    } else {
      // Colors do not match, hide them again after half a second
      setTimeout(() => {
        firstClickedItem.style.backgroundColor = "gray";
        item.style.backgroundColor = "gray";
        firstClickedItem = null;
        remainingOpenElements = 0;
        wrong.play();
        score--; // Deduct 1 point for wrong colors
        scoreDisplay.textContent = `Score: ${score}`;

        if (score === 0) {
          loose.play();
        }

        // Check if the score is 0, display game-over message
        switch (true) {
          case score === 0 && gameDifficulty === "easy":
            choosenWindow.style.display = "flex";
            messageDisplay.innerText = "Hahaha Game Over! 👎";
            messageDisplay.style.color = "#D91E36";
            setTimeout(() => {
              messageDisplay.innerText = "Sorry for the bullying";
            }, 1000);
            setTimeout(() => {
              messageDisplay.innerText = "Looser \u{1F92A}";
            }, 3000);
            score = 3;
            point = 0;
            break;

          case score === 0 && gameDifficulty === "medium":
            choosenWindow.style.display = "flex";
            messageDisplay.style.color = "#D91E36";
            messageDisplay.innerText = "You Loose \u{1F625}";
            score = 3;
            break;

          case score === 0 && gameDifficulty === "difficult":
            choosenWindow.style.display = "flex";
            messageDisplay.style.color = "#D91E36";
            messageDisplay.innerText =
              "Don't give up, you can do it !!! \u{1F608}";
            score = 3;
            break;

          default:
            console.log("check");
            break;
        }
      }, 500);
    }
  }
}

// Function to check if all elements are visible
function areAllElementsVisible() {
  const gridItems = document.querySelectorAll(".grid-item");
  for (const item of gridItems) {
    if (item.style.backgroundColor === "gray") {
      return false;
    }
  }
  return true;
}

function showMessage(message) {
  messageDisplay.textContent = message;
  messageDisplay.style.display = "block";
  restartButton.style.display = "block"; // Show the restart button
  overlay.style.display = "block"; // Show the transparent overlay
}

// Function to generate a random color
function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to shuffle an array using the Fisher-Yates algorithm
function shuffleArray(array) {
  console.log(array);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
