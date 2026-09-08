/* =========================================================
   IDEON TRADING JOURNEY PROGRESS
   ========================================================= */

const IDEON_PROGRESS_KEY = "ideonTradingProgress";
const TOTAL_STAGES = 8;


/* =========================================================
   GET / SAVE PROGRESS
   ========================================================= */

function getCompletedStages() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(IDEON_PROGRESS_KEY)
        );

        if (Array.isArray(saved)) {
            return saved.map(Number).filter(
                stage => stage >= 1 && stage <= TOTAL_STAGES
            );
        }
    } catch (error) {
        console.warn("IDEON progress could not be loaded.");
    }

    return [];
}


function saveCompletedStages(stages) {
    const uniqueStages = [...new Set(stages)]
        .sort((a, b) => a - b);

    localStorage.setItem(
        IDEON_PROGRESS_KEY,
        JSON.stringify(uniqueStages)
    );
}


/* =========================================================
   MARK A LESSON COMPLETE
   ========================================================= */

function completeLesson(stageNumber) {

    stageNumber = Number(stageNumber);

    if (
        !stageNumber ||
        stageNumber < 1 ||
        stageNumber > TOTAL_STAGES
    ) {
        return;
    }

    const completed = getCompletedStages();

    if (!completed.includes(stageNumber)) {
        completed.push(stageNumber);
        saveCompletedStages(completed);
    }
}


/* =========================================================
   DETECT CURRENT LESSON
   ========================================================= */

function getCurrentLessonNumber() {

    const filename =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    const match = filename.match(/^lesson(\d+)\.html$/);

    if (!match) {
        return null;
    }

    return Number(match[1]);
}


/* =========================================================
   LESSON PAGE
   Automatically marks the lesson complete when the
   completion button is clicked.
   ========================================================= */

function setupLessonCompletion() {

    const stageNumber = getCurrentLessonNumber();

    if (!stageNumber) {
        return;
    }

    const completionLinks =
        document.querySelectorAll(
            ".complete-section a"
        );

    completionLinks.forEach(link => {

        link.addEventListener("click", () => {
            completeLesson(stageNumber);
        });

    });
}


/* =========================================================
   TRADE PAGE PROGRESS
   ========================================================= */

function setupTradeProgress() {

    const journeyItems =
        document.querySelectorAll(".journey-item");

    if (!journeyItems.length) {
        return;
    }

    const completed = getCompletedStages();

    const progressCount =
        document.querySelector(".progress-count");

    const progressFill =
        document.querySelector(".progress-fill");

    const progressBottom =
        document.querySelector(".progress-bottom");

    const completedCount =
        completed.length;

    const percentage =
        Math.round(
            (completedCount / TOTAL_STAGES) * 100
        );


    /* ================= PROGRESS NUMBER ================= */

    if (progressCount) {
        progressCount.textContent =
            `${completedCount} / ${TOTAL_STAGES}`;
    }


    /* ================= PROGRESS BAR ================= */

    if (progressFill) {
        progressFill.style.width =
            `${percentage}%`;
    }


    /* ================= PERCENTAGE TEXT ================= */

    if (progressBottom) {

        const percentageText =
            progressBottom.querySelector(
                "span:last-child"
            );

        if (percentageText) {
            percentageText.textContent =
                `${percentage}% completed`;
        }
    }


    /* ================= FIND NEXT STAGE ================= */

    let nextStage = null;

    for (let stage = 1; stage <= TOTAL_STAGES; stage++) {

        if (!completed.includes(stage)) {
            nextStage = stage;
            break;
        }
    }


    /* ================= UPDATE EACH STAGE ================= */

    journeyItems.forEach(item => {

        const marker =
            item.querySelector(".stage-marker");

        const status =
            item.querySelector(".stage-status");

        const button =
            item.querySelector(".stage-button");

        if (!marker) {
            return;
        }

        const stageNumber =
            parseInt(
                marker.textContent.trim(),
                10
            );

        if (!stageNumber) {
            return;
        }


        /* -----------------------------------------
           COMPLETED
           ----------------------------------------- */

        if (completed.includes(stageNumber)) {

            if (status) {

                status.textContent = "✓ DONE";

                status.classList.remove(
                    "active-status"
                );

                status.style.color = "#a78bfa";
                status.style.borderColor =
                    "rgba(139,92,246,0.35)";
                status.style.background =
                    "rgba(139,92,246,0.08)";
            }


            if (button) {

                button.style.opacity = "0.85";
                button.style.pointerEvents = "auto";

                const buttonText =
                    button.childNodes[0];

                if (
                    buttonText &&
                    buttonText.nodeType === 3
                ) {
                    buttonText.textContent =
                        "REVIEW LESSON ";
                }
            }

        }


        /* -----------------------------------------
           NEXT AVAILABLE
           ----------------------------------------- */

        else if (stageNumber === nextStage) {

            if (status) {

                status.textContent = "READY";

                status.classList.add(
                    "active-status"
                );

                status.style.color = "";
                status.style.borderColor = "";
                status.style.background = "";
            }


            if (button) {

                button.style.opacity = "1";
                button.style.pointerEvents = "auto";

                const buttonText =
                    button.childNodes[0];

                if (
                    buttonText &&
                    buttonText.nodeType === 3
                ) {
                    buttonText.textContent =
                        "START LESSON ";
                }
            }

        }


        /* -----------------------------------------
           LOCKED FUTURE STAGES
           ----------------------------------------- */

        else {

            if (status) {

                status.textContent = "LOCKED";

                status.classList.remove(
                    "active-status"
                );

                status.style.color =
                    "rgba(255,255,255,0.25)";

                status.style.borderColor =
                    "rgba(255,255,255,0.08)";

                status.style.background =
                    "rgba(255,255,255,0.025)";
            }


            if (button) {

                button.style.opacity = "0.35";
                button.style.cursor = "not-allowed";

                button.addEventListener(
                    "click",
                    event => {
                        event.preventDefault();
                    }
                );
            }
        }

    });
}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupLessonCompletion();
        setupTradeProgress();

    }
);