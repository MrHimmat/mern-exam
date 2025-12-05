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



// -------------------------
// BLOCK SCREENSHOT FEATURE
// -------------------------

// Block PrintScreen (PrtSc)
document.addEventListener("keydown", function (e) {
  if (e.key === "PrintScreen") {
    navigator.clipboard.writeText("");
    alert("Screenshots are disabled for this exam.");
  }

  // Block Windows screenshot shortcuts
  if (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s")) {
    e.preventDefault();
    alert("Screenshots are disabled for this exam.");
  }
});

// Try to clear screenshot clipboard every 500ms
setInterval(() => {
  navigator.clipboard.writeText("");
}, 500);

// Detect suspicious visibility change (screenshot tools)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    // Optional: blur screen on suspected screenshot
    document.body.style.filter = "blur(10px)";
  } else {
    document.body.style.filter = "none";
  }
});

// Block developer tools shortcuts (users use it for capturing)
document.addEventListener("keydown", (e) => {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && e.key === "I") ||
    (e.ctrlKey && e.shiftKey && e.key === "C") ||
    (e.ctrlKey && e.shiftKey && e.key === "J")
  ) {
    e.preventDefault();
    alert("Developer tools are disabled during the exam.");
  }
});


// --------------------------------------------
// BLOCK SCREENSHOTS (Desktop + Mobile MAX)
// --------------------------------------------

// Disable long press save / screenshot helpers
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("touchstart", (e) => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

document.addEventListener("gesturestart", (e) => e.preventDefault());


// Detect mobile screenshot via visibility change
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden") {
    blurScreen();
  } else {
    unblurScreen();
  }
});

function blurScreen() {
  document.body.style.filter = "blur(25px)";
}

function unblurScreen() {
  document.body.style.filter = "none";
}


// Block PrintScreen (Desktop)
document.addEventListener("keydown", function (e) {
  if (e.key === "PrintScreen") {
    navigator.clipboard.writeText("");
    alert("Screenshots are disabled during the exam.");
  }
});

// Clear clipboard continuously
setInterval(() => {
  navigator.clipboard.writeText("");
}, 500);


// Block dev tools screenshots
document.addEventListener("keydown", (e) => {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && e.key === "I") ||
    (e.ctrlKey && e.shiftKey && e.key === "C") ||
    (e.ctrlKey && e.shiftKey && e.key === "J")
  ) {
    e.preventDefault();
    alert("Developer tools are disabled during the exam.");
  }
});

// Detect mobile screen recording attempt
setInterval(() => {
  if (window.screen.height !== document.documentElement.clientHeight) {
    blurScreen();
  }
}, 1000);


// Prevent built-in browser capture (Android)
document.addEventListener("keydown", (e) => {
  // Android screenshot shortcut
  if (e.key === "VolumeDown" || e.key === "Power") {
    blurScreen();
  }
});

// Detect Mobile Screen Recorder (experimental)
let originalTitle = document.title;
setInterval(() => {
  if (document.title !== originalTitle) {
    blurScreen();
  }
}, 1500);

