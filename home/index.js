// Array of five different colors
const colors = ["#FF5733", "#33FF57", "#5733FF", "#FF33E9", "#33E9FF"];

// Get all grid items
const gridItems = document.querySelectorAll(".grid-item");
const scoreDisplay = document.querySelector(".score"); // Display element for the score
const messageDisplay = document.querySelector(".message"); // Display element for messages

let firstClicked = null; // Store the first clicked element
let secondClicked = null; // Store the second clicked element
let matchedPairs = 0; // Counter for matched pairs
let score = 3; // Starting score

// Variable to track the color of the previously clicked item
let prevClickedColor = null;

// Shuffle the colors array to randomize the color assignment
for (let i = colors.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [colors[i], colors[j]] = [colors[j], colors[i]];
}

// Update the score display
function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

// Function to handle the end of the game
function endGame(message) {
  messageDisplay.innerHTML = message;
  messageDisplay.style.display = "flex";
}

// Add a click event listener to each grid item
gridItems.forEach((item, index) => {
  // Initially, hide the color by setting the background to a default color
  item.style.backgroundColor = "gray";

  item.addEventListener("click", () => {
    // If the player has already finished the game, do nothing
    if (matchedPairs === colors.length / 2) {
      return;
    }

    // If no element has been clicked yet, store this as the first clicked element
    if (firstClicked === null) {
      firstClicked = item;
      item.style.backgroundColor = colors[index % 5]; // Reveal the color
    } else if (secondClicked === null && item !== firstClicked) {
      // If a first element has been clicked and the clicked item is not the same as the first one
      secondClicked = item;
      item.style.backgroundColor = colors[index % 5]; // Reveal the color

      // Check if the colors match
      if (
        firstClicked.style.backgroundColor ===
        secondClicked.style.backgroundColor
      ) {
        // Colors match, so the elements should stay revealed
        firstClicked = null;
        secondClicked = null;
        matchedPairs++;
        prevClickedColor = null;

        // Check if the player has matched all pairs
        if (matchedPairs === colors.length / 2) {
          endGame("Congratulations! You won the game.");
        }
      } else {
        // Colors don't match, so reset both clicked elements after a delay
        setTimeout(() => {
          firstClicked.style.backgroundColor = "gray";
          secondClicked.style.backgroundColor = "gray";
          firstClicked = null;
          secondClicked = null;
          prevClickedColor = null;
          score--;
          updateScore();

          // Check if the player has lost all points
          if (score === 0) {
            endGame(
              '<div style="display: flex; align-items: center; justify-content: center;"><h1>Game over! You lost.</h1><h1 style="color: red;">Click to play again.</h1></div>'
            );
          }
        }, 500); // Delayed reset to hide the colors again
      }

      // Check if the current click has the same color as the previous click
      if (item.style.backgroundColor === prevClickedColor) {
        score++; // Earn 1 point for matching the same color twice in a row
        updateScore();
      }
      prevClickedColor = item.style.backgroundColor;
    }
  });
});

// Reset the game when the player clicks on the message display to play again
messageDisplay.addEventListener("click", () => {
  gridItems.forEach((item) => {
    item.style.backgroundColor = "gray";
  });

  // Shuffle the colors array again
  for (let i = colors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colors[i], colors[j]] = [colors[j], colors[i]];
  }

  // Reset variables
  firstClicked = null;
  secondClicked = null;
  matchedPairs = 0;
  score = 3;
  prevClickedColor = null;

  updateScore();
  messageDisplay.style.display = "none";
});

const revealButton = document.getElementById("revealButton");

revealButton.addEventListener("click", () => {
  gridItems.forEach((item, index) => {
    item.style.backgroundColor = colors[index % 5];
  });

  revealButton.style.display = "none";

  setTimeout(() => {
    gridItems.forEach((item) => {
      item.style.backgroundColor = "gray";
    });

    revealButton.style.display = "block";
  }, 2000);
});
