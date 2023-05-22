let images = [
  "images/1.jpg",
  "images/2.jpg",
  "images/3.jpg",
  "images/4.jpg",
  "images/5.jpg",
  "images/6.jpg",
  "images/7.jpg",
  "images/8.jpg",
  "images/9.jpg",
  "images/10.jpg",
  "images/11.jpg",
  "images/12.jpg",
  "images/13.jpg",
  "images/14.jpg",
  "images/15.jpg",
  "images/16.jpg",
  "images/17.jpg",
  "images/18.jpg",
  "images/19.jpg",
  "images/20.jpg",
  "images/21.jpg",
  "images/22.jpg",
  "images/23.jpg",
  "images/24.jpg",
  "images/25.jpg",
];
let currentImage = 0; //first index is Zero
let sliderImage = document.querySelector(".slider__image"); //search for image
//below is - search for buttons
let nextBtn = document.querySelector(".slider__button-next");
let prevBtn = document.querySelector(".slider__button-prev");
let playBtn = document.querySelector(".slider__button-play");

//function to display the next image of the slider
function nextImage() {
  if (currentImage < images.length - 1) {
    currentImage++;
  } else {
    currentImage = 0;
  }
  sliderImage.src = images[currentImage];
}

//function to display the prev image of the slider
function prevImage() {
  if (currentImage > 0) {
    currentImage--;
  } else {
    currentImage = images.length - 1;
  }
  sliderImage.src = images[currentImage];
}

//to stop autoplay from playing when clicked twice
let interval;

// for autoplay
function autoplay() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  } else {
    interval = setInterval(() => {
      nextImage();
    }, 1500);
  }

  playBtn.children[0].classList.toggle("fa-play");
  playBtn.children[0].classList.toggle("fa-pause");
}

//see above - toggle allows add and remove new classes
//we want to change Play icon with Pause icon

nextBtn.addEventListener("click", nextImage); //mouse click
prevBtn.addEventListener("click", prevImage);
playBtn.addEventListener("click", autoplay);
