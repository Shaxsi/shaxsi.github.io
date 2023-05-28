let dogs = ["1", "2", "3", "4", "5"];
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let body = document.body;
let scores = document.querySelectorAll(".score");
let num = 0;
let total = 10;
let currentDog = 0;
let gameOver = false;
let totalShadow = document.querySelector(".total-shadow");
let startBtn = document.querySelector(".start-game-button");

function createDog() {
  let div = document.createElement("div");
  let rand = Math.floor(Math.random() * dogs.length);
  div.className = "dog dog-" + dogs[rand];

  rand = Math.floor(Math.random() * (windowWidth - 100)); // to make dogs appear in different places
  div.style.left = rand + "px";
  div.dataset.number = currentDog;
  currentDog++;

  body.appendChild(div); // adding the class to the body
  animateDog(div);
}

function animateDog(elem) {
  let pos = 0; // dog's position
  let random = Math.floor(Math.random() * 6 - 3); // random generation of intervals for each dog
  //dogs will float at different pace
  let interval = setInterval(frame, 12 - Math.floor(num / 10) + random);
  // to increase the speed after each 10 dogs come up

  function frame() {
    // console.log(pos);
    if (
      pos >= windowHeight + 200 &&
      document.querySelector('[data-number="' + elem.dataset.number + '"]') !==
        null
    ) {
      clearInterval(interval);
      gameOver = true;
    } else {
      pos++;
      elem.style.top = windowHeight - pos + "px";
    }
  }
}

function deleteDog(elem) {
  elem.remove();
  num++;
  updateScore();
  playBallSound();
}

function playBallSound() {
  let audio = document.createElement("audio");
  audio.src = "sounds/woofTwo.mp3";
  audio.play();
}

function updateScore() {
  for (let i = 0; i < scores.length; i++) {
    scores[i].textContent = num;
  }
}

function startGame() {
  restartGame();
  let timeout = 0;

  let loop = setInterval(function () {
    timeout = Math.floor(Math.random() * 600 - 100);
    //to make dogs come up at different intervals

    if (!gameOver && num !== total) {
      createDog();
    } else if (num !== total) {
      clearInterval(loop);
      totalShadow.style.display = "flex";
      totalShadow.querySelector(".lose").style.display = "block";
    } else {
      clearInterval(loop);
      totalShadow.style.display = "flex";
      totalShadow.querySelector(".win").style.display = "block";
    }
  }, 800 + timeout);
}

function restartGame() {
  // delete all baloons after LOSE
  let forRemoving = document.querySelectorAll(".dog");
  for (let i = 0; i < forRemoving.length; i++) {
    forRemoving[i].remove();
  }
  gameOver = false;
  num = 0;
  // update score
  updateScore();
}
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("dog")) {
    deleteDog(event.target);
  } // event delegation
  //console.log(event);
});

// for YES button restart game
document.querySelector(".restart").addEventListener("click", function () {
  totalShadow.style.display = "none"; // hide the blocks LOSE or WIN
  totalShadow.querySelector(".win").style.display = "none";
  totalShadow.querySelector(".lose").style.display = "none";
  startGame();
});

// for NO button restart game
document.querySelector(".cancel").addEventListener("click", function () {
  totalShadow.style.display = "none";
});

startBtn.addEventListener("click", function () {
  startGame();
  document.querySelector(".background_music").play();
  document.querySelector(".start-game-window").style.display = "none";
});
