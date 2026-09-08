/* =========================================================
   IDEON
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL =
    "https://ceedwhwnpthqdzhtkemy.supabase.co";

/*
   KEEP YOUR EXISTING SUPABASE PUBLISHABLE KEY HERE.
   Do not change anything else.
*/
const SUPABASE_KEY =
    "sb_publishable_bGc_PDepTuhmmvVG1WMPUQ_-MlnP8hO";


/* =========================================================
   IDEON BACKEND
========================================================= */

console.log("🔥 IDEON backend configuration loaded.");


/* =========================================================
   DOM ELEMENTS
========================================================= */

const ideaInput =
    document.getElementById("ideaInput");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const resultSection =
    document.getElementById("result");

const charCount =
    document.getElementById("charCount");


/* =========================================================
   CHARACTER COUNTER
========================================================= */

function updateCharacterCount() {

    if (!ideaInput || !charCount) {
        return;
    }

    charCount.textContent =
        `${ideaInput.value.length}/500`;
}


if (ideaInput) {

    ideaInput.addEventListener(
        "input",
        updateCharacterCount
    );

    updateCharacterCount();
}


/* =========================================================
   EXAMPLE IDEAS
========================================================= */

const exampleIdeas = [

    "A smart dustbin that automatically separates wet and dry waste.",

    "A water-saving shower device that reduces water usage without affecting pressure.",

    "A backpack that charges a laptop while I carry it.",

    "A clothing brand for affordable college fashion.",

    "A mobile app that helps college students find affordable food nearby.",

    "A service that delivers healthy homemade meals to office workers.",

    "A website where local businesses can find freelance designers.",

    "A SaaS platform that helps small shops manage inventory.",

    "A platform that helps students find affordable accommodation near colleges."

];


/* =========================================================
   LOAD EXAMPLE
========================================================= */

function loadExample() {

    if (!ideaInput) {
        return;
    }

    const randomIdea =
        exampleIdeas[
            Math.floor(
                Math.random() *
                exampleIdeas.length
            )
        ];

    ideaInput.value =
        randomIdea;

    updateCharacterCount();

    ideaInput.focus();
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================================
   MAIN IDEON FUNCTION
========================================================= */

async function makePractical() {

    if (makePractical.isRunning) {

        console.log(
            "⏳ IDEON is already analyzing..."
        );

        return;
    }


    makePractical.isRunning =
        true;


    const idea =
        ideaInput
            ? ideaInput.value.trim()
            : "";


    /* -----------------------------------------
       EMPTY IDEA
    ----------------------------------------- */

    if (!idea) {

        makePractical.isRunning =
            false;

        alert(
            "Tell IDEON your idea first 💭"
        );

        if (ideaInput) {
            ideaInput.focus();
        }

        return;
    }


    /* -----------------------------------------
       MAX LENGTH
    ----------------------------------------- */

    if (idea.length > 500) {

        makePractical.isRunning =
            false;

        alert(
            "Please keep your idea under 500 characters."
        );

        return;
    }


    /* -----------------------------------------
       BUTTON ANALYZING ANIMATION
    ----------------------------------------- */

    const originalButtonText =
        analyzeBtn
            ? analyzeBtn.innerHTML
            : 'MAKE IT PRACTICAL <span>✦</span>';


    if (analyzeBtn) {

        analyzeBtn.disabled =
            true;

        analyzeBtn.classList.add(
            "analyzing"
        );

        analyzeBtn.innerHTML = `

            <span class="analyzing-text">
                ANALYZING YOUR IDEA
                <span class="loading-dots">
                    ...
                </span>
            </span>

            <span class="analyzing-star">
                ✦
            </span>

        `;
    }


    try {

        console.log(
            "🧠 Sending idea to IDEON AI..."
        );


        /* =====================================
           CALL SUPABASE EDGE FUNCTION
        ===================================== */

        const response =
            await fetch(
                `${SUPABASE_URL}/functions/v1/analyze-idea`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_KEY

                    },

                    body:
                        JSON.stringify({
                            idea: idea
                        })

                }
            );


        const data =
            await response.json();


        console.log(
            "🤖 IDEON AI analysis complete!",
            data
        );


        /* =====================================
           HANDLE API ERROR
        ===================================== */

        if (!response.ok) {

            console.error(
                "❌ AI function error:",
                data
            );

            throw new Error(
                data?.error ||
                "AI analysis failed."
            );
        }


        /* =====================================
           DISPLAY RESULT
        ===================================== */

        displayResult(data);


        /* =====================================
           SCROLL TO RESULT
        ===================================== */

        if (resultSection) {

            resultSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }


    } catch (error) {

        console.error(
            "❌ IDEON AI error:",
            error
        );

        alert(
            error?.message ||
            "IDEON couldn't analyze the idea right now. Please try again."
        );


    } finally {

        makePractical.isRunning =
            false;


        if (analyzeBtn) {

            analyzeBtn.disabled =
                false;

            analyzeBtn.classList.remove(
                "analyzing"
            );

            analyzeBtn.innerHTML =
                originalButtonText;

        }

    }

}


/* =========================================================
   DISPLAY AI RESULT
========================================================= */

function displayResult(data) {

    if (!resultSection) {
        return;
    }


    /* -----------------------------------------
       BASIC DATA
    ----------------------------------------- */

    const title =
        data.title ||
        "Your Business Concept";


    const businessType =
        data.business_type ||
        "Business";


    const feasibility =
        data.feasibility ||
        "Moderately Practical";


    const concept =
        data.practical_concept ||
        "No practical concept was generated.";


    const customer =
        data.target_customer ||
        "Target customers depend on the final business model.";


    const revenue =
        data.revenue_model ||
        "Revenue model depends on implementation.";


    const cost =
        data.startup_cost ||
        "Cost depends on implementation.";


    const potential =
        data.business_potential ||
        "Business potential depends on demand, competition and execution.";


    const competition =
        data.competition ||
        "Identify the main competitors and understand how this idea can differentiate itself.";


    const financialOutlook =
        data.financial_outlook ||
        "Test pricing, operating costs and margins before investing heavily.";


    const ideonVerdict =
        data.ideon_verdict ||
        "Worth testing with a small MVP before scaling.";


    const nextMove =
        data.next_move ||
        "Validate the idea with potential customers before spending heavily.";


    const resources =
        Array.isArray(data.resources)
            ? data.resources
            : [];


    const launchPlan =
        Array.isArray(data.launch_plan)
            ? data.launch_plan
            : [];


    const risks =
        Array.isArray(data.key_risks)
            ? data.key_risks
            : [];


    /* -----------------------------------------
       FEASIBILITY
    ----------------------------------------- */

    let feasibilityClass =
        "feasibility-normal";


    if (
        feasibility
            .toLowerCase()
            .includes("highly")
    ) {

        feasibilityClass =
            "feasibility-high";

    }


    if (
        feasibility
            .toLowerCase()
            .includes("challenging")
    ) {

        feasibilityClass =
            "feasibility-low";

    }


    /* -----------------------------------------
       RESOURCES
    ----------------------------------------- */

    const resourcesHTML =
        resources.length > 0

            ? resources
                .map(
                    item => `

                        <div class="resource-item">

                            <span class="resource-dot"></span>

                            <span>
                                ${escapeHTML(item)}
                            </span>

                        </div>

                    `
                )
                .join("")

            : `

                <div class="resource-item">

                    <span class="resource-dot"></span>

                    <span>
                        Define the resources required for the MVP.
                    </span>

                </div>

            `;


    /* -----------------------------------------
       LAUNCH PLAN
    ----------------------------------------- */

    const launchHTML =
        launchPlan.length > 0

            ? launchPlan
                .map(
                    (step, index) => `

                        <div class="launch-item">

                            <div class="launch-number">

                                ${String(
                                    index + 1
                                ).padStart(
                                    2,
                                    "0"
                                )}

                            </div>


                            <div class="launch-content">

                                ${escapeHTML(step)}

                            </div>

                        </div>

                    `
                )
                .join("")

            : `

                <div class="launch-item">

                    <div class="launch-number">
                        01
                    </div>

                    <div class="launch-content">
                        Build a simple MVP and test it with potential customers.
                    </div>

                </div>

            `;


    /* -----------------------------------------
       RISKS
    ----------------------------------------- */

    const risksHTML =
        risks.length > 0

            ? risks
                .map(
                    risk => `

                        <div class="risk-item">

                            <span class="risk-icon">
                                !
                            </span>

                            <span>
                                ${escapeHTML(risk)}
                            </span>

                        </div>

                    `
                )
                .join("")

            : `

                <div class="risk-item">

                    <span class="risk-icon">
                        !
                    </span>

                    <span>
                        Market demand and execution should be tested.
                    </span>

                </div>

            `;


    /* =================================================
       RESULT HTML
    ================================================= */

    resultSection.innerHTML = `

        <div class="ai-result-shell">


            <!-- =================================
                 RESULT HEADER
            ================================= -->

            <div class="ai-result-header">

                <div class="ai-result-label">

                    <span class="live-dot"></span>

                    IDEON AI ANALYSIS

                </div>


                <h2>
                    ${escapeHTML(title)}
                </h2>


                <div class="ai-result-meta">

                    <span class="business-badge">

                        ${escapeHTML(
                            businessType
                        )}

                    </span>


                    <span class="${feasibilityClass}">

                        <span class="status-dot"></span>

                        ${escapeHTML(
                            feasibility
                        )}

                    </span>

                </div>

            </div>


            <!-- =================================
                 CONCEPT
            ================================= -->

            <div class="ai-feature-card">

                <div class="feature-top">

                    <div class="feature-icon">
                        ✦
                    </div>


                    <div>

                        <div class="feature-label">
                            The Concept
                        </div>

                        <h3>
                            How your idea works
                        </h3>

                    </div>

                </div>


                <p>
                    ${escapeHTML(concept)}
                </p>

            </div>


            <!-- =================================
                 BUSINESS SNAPSHOT
            ================================= -->

            <div class="ai-section-heading">

                <span>
                    01
                </span>

                Business Snapshot

            </div>


            <div class="ai-snapshot-grid">


                <!-- TARGET CUSTOMER -->

                <div class="ai-info-card">

                    <div class="info-heading">

                        <span class="info-icon">
                            👥
                        </span>

                        <span class="info-label">
                            Target Customer
                        </span>

                    </div>


                    <p>
                        ${escapeHTML(customer)}
                    </p>

                </div>


                <!-- REVENUE -->

                <div class="ai-info-card">

                    <div class="info-heading">

                        <span class="info-icon">
                            ₹
                        </span>

                        <span class="info-label">
                            Revenue Model
                        </span>

                    </div>


                    <p>
                        ${escapeHTML(revenue)}
                    </p>

                </div>


                <!-- COST -->

                <div class="ai-info-card cost-card">

                    <div class="info-heading">

                        <span class="info-icon">
                            ◈
                        </span>

                        <span class="info-label">
                            Estimated Starting Cost
                        </span>

                    </div>


                    <div class="big-cost">

                        ${escapeHTML(cost)}

                    </div>

                </div>


                <!-- BUSINESS POTENTIAL -->

                <div class="ai-info-card potential-card">

                    <div class="info-heading">

                        <span class="info-icon">
                            ↗
                        </span>

                        <span class="info-label">
                            Business Potential
                        </span>

                    </div>


                    <p>
                        ${escapeHTML(potential)}
                    </p>

                </div>

            </div>


            <!-- =================================
                 BUILD THE BUSINESS
            ================================= -->

            <div class="ai-section-heading">

                <span>
                    02
                </span>

                Build The Business

            </div>


            <div class="ai-build-grid">


                <!-- RESOURCES -->

                <div class="ai-panel">

                    <div class="panel-header">

                        <div class="panel-icon">
                            ⚙
                        </div>


                        <div>

                            <div class="panel-label">
                                What You Need
                            </div>

                            <h3>
                                Required Resources
                            </h3>

                        </div>

                    </div>


                    <div class="resource-list">

                        ${resourcesHTML}

                    </div>

                </div>


                <!-- LAUNCH PLAN -->

                <div class="ai-panel launch-panel">

                    <div class="panel-header">

                        <div class="panel-icon">
                            🚀
                        </div>


                        <div>

                            <div class="panel-label">
                                From Idea To MVP
                            </div>

                            <h3>
                                Launch Plan
                            </h3>

                        </div>

                    </div>


                    <div class="launch-list">

                        ${launchHTML}

                    </div>

                </div>

            </div>


            <!-- =================================
                 REALITY CHECK
            ================================= -->

            <div class="ai-section-heading">

                <span>
                    03
                </span>

                Reality Check

            </div>


            <div class="reality-grid">


                <!-- COMPETITION -->

                <div class="ai-info-card reality-card">

                    <div class="info-heading">

                        <span class="info-icon">
                            ⚔
                        </span>

                        <span class="info-label">
                            Competition
                        </span>

                    </div>


                    <p>
                        ${escapeHTML(competition)}
                    </p>

                </div>


                <!-- FINANCIAL OUTLOOK -->

                <div class="ai-info-card reality-card">

                    <div class="info-heading">

                        <span class="info-icon">
                            ₹
                        </span>

                        <span class="info-label">
                            Financial Outlook
                        </span>

                    </div>


                    <p>
                        ${escapeHTML(financialOutlook)}
                    </p>

                </div>

            </div>


            <!-- =================================
                 KEY RISKS
            ================================= -->

            <div class="risk-panel">

                <div class="risk-header">

                    <div class="risk-main-icon">
                        !
                    </div>


                    <div>

                        <div class="panel-label">
                            Don't Ignore These
                        </div>

                        <h3>
                            Key Risks
                        </h3>

                    </div>

                </div>


                <div class="risk-list">

                    ${risksHTML}

                </div>

            </div>


            <!-- =================================
                 IDEON VERDICT
            ================================= -->

            <div class="verdict-panel">

                <div class="verdict-top">

                    <div class="verdict-icon">
                        ✦
                    </div>


                    <div>

                        <div class="panel-label">
                            IDEON Verdict
                        </div>

                        <h3>
                            ${escapeHTML(
                                ideonVerdict
                            )}
                        </h3>

                    </div>

                </div>


                <div class="next-move">

                    <span class="next-move-label">
                        Next Move
                    </span>

                    <span class="next-move-arrow">
                        →
                    </span>

                    <span>
                        ${escapeHTML(
                            nextMove
                        )}
                    </span>

                </div>

            </div>


            <!-- =================================
                 FOOTER
            ================================= -->

            <div class="ai-footer-note">

                <span>
                    ✦
                </span>

                Analysis generated by IDEON AI

            </div>


        </div>

    `;


    resultSection.classList.add(
        "result-visible"
    );

}


/* =========================================================
   ENTER KEY
========================================================= */

if (ideaInput) {

    ideaInput.addEventListener(
        "keydown",
        function (event) {

            /*
               Shift + Enter = new line
               Enter = analyze
            */

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                makePractical();

            }

        }
    );

}


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.makePractical =
    makePractical;


window.loadExample =
    loadExample;


/* =========================================================
   IDEON READY
========================================================= */

console.log(
    "🚀 IDEON is ready."
);


/* =========================================================
   HERO PARTICLES
========================================================= */

(function () {

    const canvas =
        document.getElementById(
            "ideon-hero-canvas"
        );

    if (!canvas) {
        return;
    }


    const ctx =
        canvas.getContext("2d");


    const hero =
        canvas.parentElement;


    let width = 0;

    let height = 0;

    let dpr = 1;

    let particles = [];

    let animationFrameId = null;


    const PURPLE =
        "168, 85, 247";


    const BLUE =
        "96, 165, 250";


    class Particle {

        constructor(x, y) {

            this.x = x;

            this.y = y;


            const angle =
                Math.random() *
                Math.PI *
                2;


            const speed =
                0.035 +
                Math.random() *
                0.09;


            this.vx =
                Math.cos(angle) *
                speed;


            this.vy =
                Math.sin(angle) *
                speed;


            this.radius =
                Math.random() < 0.85

                    ? 0.8 +
                      Math.random() *
                      1.1

                    : 1.5 +
                      Math.random() *
                      1.2;


            this.color =
                Math.random() < 0.18
                    ? BLUE
                    : PURPLE;


            this.alpha =
                0.28 +
                Math.random() *
                0.38;


            this.phase =
                Math.random() *
                Math.PI *
                2;


            this.phaseSpeed =
                0.004 +
                Math.random() *
                0.008;

        }


        update() {

            this.x +=
                this.vx;


            this.y +=
                this.vy;


            const margin =
                80;


            if (
                this.x <
                -margin
            ) {
                this.x =
                    width +
                    margin;
            }


            if (
                this.x >
                width +
                margin
            ) {
                this.x =
                    -margin;
            }


            if (
                this.y <
                -margin
            ) {
                this.y =
                    height +
                    margin;
            }


            if (
                this.y >
                height +
                margin
            ) {
                this.y =
                    -margin;
            }


            this.phase +=
                this.phaseSpeed;

        }


        draw() {

            const pulse =
                Math.sin(
                    this.phase
                );


            const alpha =
                this.alpha +
                pulse *
                0.10;


            ctx.save();


            ctx.beginPath();


            ctx.arc(
                this.x,
                this.y,
                this.radius,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(${this.color}, ${alpha})`;


            ctx.shadowColor =
                `rgba(${this.color}, 0.75)`;


            ctx.shadowBlur =
                7;


            ctx.fill();


            ctx.restore();

        }

    }


    function resize() {

        dpr =
            Math.min(
                window.devicePixelRatio ||
                1,
                2
            );


        const rect =
            hero.getBoundingClientRect();


        width =
            rect.width;


        height =
            rect.height;


        canvas.width =
            Math.floor(
                width *
                dpr
            );


        canvas.height =
            Math.floor(
                height *
                dpr
            );


        canvas.style.width =
            width +
            "px";


        canvas.style.height =
            height +
            "px";


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );


        let spacing;


        if (width > 1200) {

            spacing =
                105;

        } else if (width > 768) {

            spacing =
                115;

        } else {

            spacing =
                95;

        }


        const columns =
            Math.ceil(
                width /
                spacing
            );


        const rows =
            Math.ceil(
                height /
                spacing
            );


        particles = [];


        for (
            let row = 0;
            row < rows;
            row++
        ) {

            for (
                let col = 0;
                col < columns;
                col++
            ) {

                const cellWidth =
                    width /
                    columns;


                const cellHeight =
                    height /
                    rows;


                const x =
                    col *
                    cellWidth +
                    Math.random() *
                    cellWidth;


                const y =
                    row *
                    cellHeight +
                    Math.random() *
                    cellHeight;


                particles.push(
                    new Particle(
                        x,
                        y
                    )
                );

            }

        }


        const edgeParticles =
            width > 1200
                ? 35
                : 20;


        for (
            let i = 0;
            i < edgeParticles;
            i++
        ) {

            let x;

            let y;


            const side =
                Math.floor(
                    Math.random() *
                    4
                );


            if (side === 0) {

                x =
                    Math.random() *
                    width;

                y =
                    Math.random() *
                    70;

            }

            else if (side === 1) {

                x =
                    Math.random() *
                    width;

                y =
                    height -
                    Math.random() *
                    70;

            }

            else if (side === 2) {

                x =
                    Math.random() *
                    70;

                y =
                    Math.random() *
                    height;

            }

            else {

                x =
                    width -
                    Math.random() *
                    70;

                y =
                    Math.random() *
                    height;

            }


            particles.push(
                new Particle(
                    x,
                    y
                )
            );

        }

    }


    function drawConnections() {

        const maxDistance =
            width < 768
                ? 100
                : 135;


        const maxDistanceSq =
            maxDistance *
            maxDistance;


        for (
            let i = 0;
            i < particles.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < particles.length;
                j++
            ) {

                const a =
                    particles[i];


                const b =
                    particles[j];


                const dx =
                    a.x -
                    b.x;


                const dy =
                    a.y -
                    b.y;


                const distanceSq =
                    dx * dx +
                    dy * dy;


                if (
                    distanceSq <
                    maxDistanceSq
                ) {

                    const distance =
                        Math.sqrt(
                            distanceSq
                        );


                    const opacity =
                        Math.pow(
                            1 -
                            distance /
                            maxDistance,
                            3
                        ) *
                        0.055;


                    ctx.beginPath();


                    ctx.moveTo(
                        a.x,
                        a.y
                    );


                    ctx.lineTo(
                        b.x,
                        b.y
                    );


                    ctx.strokeStyle =
                        `rgba(${PURPLE}, ${opacity})`;


                    ctx.lineWidth =
                        0.5;


                    ctx.stroke();

                }

            }

        }

    }


    function animate() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        drawConnections();


        particles.forEach(
            particle => {

                particle.update();

                particle.draw();

            }
        );


        animationFrameId =
            requestAnimationFrame(
                animate
            );

    }


    function start() {

        resize();


        if (animationFrameId) {

            cancelAnimationFrame(
                animationFrameId
            );

        }


        animationFrameId =
            requestAnimationFrame(
                animate
            );

    }


    const observer =
        new ResizeObserver(
            resize
        );


    observer.observe(
        hero
    );


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            start
        );

    } else {

        start();

    }

})();