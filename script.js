let totalExamSeconds = 3 * 60 * 60; // 3 hours
let timerInterval;
let warningShown = false;

const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const questions = document.getElementById("questions-container");
const timeUpModal = document.getElementById("timeUpModal");

// On page load
window.onload = function () {
  const examStartTime = localStorage.getItem("examStartTime");
  const examFinished = localStorage.getItem("examFinished");

  // If exam is already finished
  if (examFinished === "true") {
    lockExam();
    return;
  }

  // If exam started earlier
  if (examStartTime) {
    const timePassed = Math.floor((Date.now() - examStartTime) / 1000);
    let remaining = totalExamSeconds - timePassed;

    if (remaining <= 0) {
      lockExam();
      return;
    }

    totalExamSeconds = remaining;
    startBtn.disabled = true;
    startTimer();
  }
};

// Start exam
startBtn.addEventListener("click", () => {
  if (!localStorage.getItem("examStartTime")) {
    localStorage.setItem("examStartTime", Date.now());
  }
  startBtn.disabled = true;
  startTimer();
});

// Start countdown
function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

// Update timer each second
function updateTimer() {
  let hours = Math.floor(totalExamSeconds / 3600);
  let minutes = Math.floor((totalExamSeconds % 3600) / 60);
  let seconds = totalExamSeconds % 60;

  timerEl.textContent = 
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;

  // Warning at 10 minutes
  if (totalExamSeconds === 10 * 60 && !warningShown) {
    warningShown = true;
    alert("⚠️ Only 10 minutes left!");
  }

  // Time up
  if (totalExamSeconds <= 0) {
    clearInterval(timerInterval);
    endExam();
  }

  totalExamSeconds--;
}

// When time finishes
function endExam() {
  localStorage.setItem("examFinished", "true");
  lockExam();
}

// Lock exam permanently
function lockExam() {
  questions.style.display = "none";
  timeUpModal.style.display = "flex";

  startBtn.disabled = true;

  // Prevent timer display confusion
  timerEl.textContent = "00:00:00";

  // Remove start time so timer doesn't restart
  localStorage.removeItem("examStartTime");
}


// Secret Reset Button (Admin Only)
document.getElementById("secretResetBtn").addEventListener("click", () => {
  const confirmReset = confirm("Are you sure? This will reset the exam.");
  if (confirmReset) {
    localStorage.removeItem("examStartTime");
    localStorage.removeItem("examFinished");
    location.reload();
  }
});
