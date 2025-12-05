let totalExamSeconds = 3 * 60 * 60; // 3 hours
let timerInterval;
let warningShown = false;

const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const questions = document.getElementById("questions-container");
const timeUpModal = document.getElementById("timeUpModal");

// -------------------------
// On Page Load
// -------------------------
window.onload = function () {
  const examStartTime = localStorage.getItem("examStartTime");
  const examFinished = localStorage.getItem("examFinished");

  // If exam is already finished
  if (examFinished === "true") {
    lockExam();
    return;
  }

  // If exam started earlier → continue exam
  if (examStartTime) {
    removeBlur(); // 🔥 important: no blur on reload

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

// -------------------------
// Start Exam
// -------------------------
startBtn.addEventListener("click", () => {
  removeBlur();

  if (!localStorage.getItem("examStartTime")) {
    localStorage.setItem("examStartTime", Date.now());
  }

  startBtn.disabled = true;
  startTimer();
});

// -------------------------
// Remove blur function
// -------------------------
function removeBlur() {
  questions.classList.remove("blur");
}

// -------------------------
// Start countdown
// -------------------------
function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

// -------------------------
// Update timer
// -------------------------
function updateTimer() {
  let hours = Math.floor(totalExamSeconds / 3600);
  let minutes = Math.floor((totalExamSeconds % 3600) / 60);
  let seconds = totalExamSeconds % 60;

  timerEl.textContent =
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;

  // 10-minute warning
  if (totalExamSeconds === 10 * 60 && !warningShown) {
    warningShown = true;
    alert("⚠️ Only 10 minutes left!");
  }

  // Time up
  if (totalExamSeconds <= 0) {
    clearInterval(timerInterval);
    endExam();
    return;
  }

  totalExamSeconds--;
}

// -------------------------
// When time finishes
// -------------------------
function endExam() {
  localStorage.setItem("examFinished", "true");
  lockExam();
}

// -------------------------
// Lock exam permanently
// -------------------------
function lockExam() {
  questions.style.display = "none";
  timeUpModal.style.display = "flex";

  startBtn.disabled = true;

  timerEl.textContent = "00:00:00";

  // Remove start time so exam doesn't restart
  localStorage.removeItem("examStartTime");
}

// -------------------------
// Secret Reset Button
// -------------------------
document.getElementById("secretResetBtn").addEventListener("click", () => {
  const confirmReset = confirm("Are you sure? This will reset the exam.");
  if (confirmReset) {
    localStorage.removeItem("examStartTime");
    localStorage.removeItem("examFinished");
    location.reload();
  }
});


