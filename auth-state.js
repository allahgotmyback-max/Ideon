/* =========================================
   IDEON GLOBAL AUTH STATE
   ========================================= */

(function () {

    const SUPABASE_URL =
        "https://ceedwhwnpthqdzhtkemy.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_bGc_PDepTuhmmvVG1WMPUQ_-MlnP8hO";


    /* -----------------------------------------
       LOAD SUPABASE
    ----------------------------------------- */

    function loadSupabase() {

        return new Promise((resolve, reject) => {

            if (window.supabase) {
                resolve();
                return;
            }

            const script =
                document.createElement("script");

            script.src =
                "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

            script.onload = resolve;

            script.onerror = () =>
                reject(
                    new Error("Could not load Supabase.")
                );

            document.head.appendChild(script);
        });
    }


    /* -----------------------------------------
       AUTH STYLES
    ----------------------------------------- */

    function addAuthStyles() {

        if (
            document.getElementById(
                "ideon-auth-styles"
            )
        ) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "ideon-auth-styles";

        style.textContent = `

            .ideon-account-wrap {
                display: flex;
                align-items: center;
                gap: 9px;
                position: relative;
            }


            .ideon-account {
                display: flex;
                align-items: center;
                gap: 9px;

                min-height: 40px;

                padding: 5px 9px 5px 7px;

                border: 1px solid
                    rgba(255,255,255,.09);

                border-radius: 11px;

                background:
                    rgba(255,255,255,.035);

                color: #fff;

                text-decoration: none;

                cursor: pointer;
            }


            .ideon-account-avatar {

                width: 29px;
                height: 29px;

                border-radius: 9px;

                display: flex;
                align-items: center;
                justify-content: center;

                background:
                    linear-gradient(
                        135deg,
                        #8050ff,
                        #a06fff
                    );

                color: #fff;

                font-size: 11px;
                font-weight: 800;
            }


            .ideon-account-text {

                display: flex;
                flex-direction: column;
                align-items: flex-start;

                line-height: 1.1;
            }


            .ideon-account-name {

                max-width: 110px;

                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                font-size: 12px;
                font-weight: 800;
            }


            .ideon-account-plan {

                margin-top: 3px;

                color: #a77cff;

                font-size: 9px;
                font-weight: 800;

                letter-spacing: .7px;
            }


            .ideon-logout {

                height: 40px;

                padding: 0 12px;

                border: 1px solid
                    rgba(255,255,255,.08);

                border-radius: 10px;

                background: transparent;

                color: #aaa5b8;

                font-size: 11px;
                font-weight: 700;

                cursor: pointer;
            }


            .ideon-logout:hover {

                color: #fff;

                border-color:
                    rgba(135,92,255,.35);
            }


            @media (max-width: 700px) {

                .ideon-account-wrap {
                    gap: 5px;
                }


                .ideon-account {

                    min-height: 36px;

                    padding:
                        4px 7px;
                }


                .ideon-account-avatar {

                    width: 27px;
                    height: 27px;
                }


                .ideon-account-name {

                    max-width: 72px;

                    font-size: 10px;
                }


                .ideon-account-plan {

                    font-size: 8px;
                }


                .ideon-logout {

                    height: 36px;

                    padding: 0 8px;

                    font-size: 9px;
                }

            }

        `;

        document.head.appendChild(style);
    }


    /* -----------------------------------------
       INITIALS
    ----------------------------------------- */

    function getInitials(name) {

        const words =
            (name || "IDEON User")
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        if (!words.length) {
            return "I";
        }


        if (words.length === 1) {

            return words[0]
                .slice(0, 2)
                .toUpperCase();
        }


        return (
            words[0][0] +
            words[words.length - 1][0]
        ).toUpperCase();
    }


    /* -----------------------------------------
       FIND NAVBAR BUTTON
    ----------------------------------------- */

    function findNavbarButton() {

        return document.querySelector(
            ".nav-cta, .nav-button, .nav-btn"
        );
    }


    /* -----------------------------------------
       LOGGED OUT
    ----------------------------------------- */

    function renderLoggedOut() {

        const button =
            findNavbarButton();


        if (!button) {
            return;
        }


        button.style.display = "";


        if (
            button.classList.contains(
                "nav-cta"
            ) ||
            button.classList.contains(
                "nav-button"
            )
        ) {

            button.textContent =
                "Get Started →";

            button.href =
                "signup.html";

            button.removeAttribute(
                "onclick"
            );

        } else {

            button.textContent =
                "Get Started →";

            button.onclick =
                function () {

                    window.location.href =
                        "signup.html";
                };
        }
    }


    /* -----------------------------------------
       LOGGED IN
    ----------------------------------------- */

    function renderLoggedIn(user) {

        const button =
            findNavbarButton();


        if (!button) {
            return;
        }


        const metadata =
            user.user_metadata || {};


        const name =
            metadata.full_name ||
            user.email?.split("@")[0] ||
            "IDEON User";


        const plan =
            metadata.plan ||
            "free";


        const displayPlan =
            String(plan).toUpperCase();


        const wrapper =
            document.createElement("div");


        wrapper.className =
            "ideon-account-wrap";


        wrapper.innerHTML = `

            <a
                href="profile.html"
                class="ideon-account"
            >

                <span
                    class="ideon-account-avatar"
                >
                    ${getInitials(name)}
                </span>


                <span
                    class="ideon-account-text"
                >

                    <span
                        class="ideon-account-name"
                    >
                        ${escapeHTML(name)}
                    </span>


                    <span
                        class="ideon-account-plan"
                    >
                        ${escapeHTML(displayPlan)}
                    </span>

                </span>

            </a>


            <button
                type="button"
                class="ideon-logout"
                id="ideonLogoutBtn"
            >
                Logout
            </button>

        `;


        button.replaceWith(wrapper);


        document
            .getElementById(
                "ideonLogoutBtn"
            )
            .addEventListener(
                "click",
                async function () {

                    this.disabled = true;

                    this.textContent =
                        "Logging out...";


                    try {

                        const {
                            error
                        } =
                            await window
                                .ideonSupabase
                                .auth
                                .signOut();


                        if (error) {
                            throw error;
                        }

                    } catch (error) {

                        console.error(
                            "IDEON logout error:",
                            error
                        );
                    }


                    localStorage.removeItem(
                        "ideonUser"
                    );


                    window.location.href =
                        "Home.html";
                }
            );
    }


    /* -----------------------------------------
       ESCAPE HTML
    ----------------------------------------- */

    function escapeHTML(value) {

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


    /* -----------------------------------------
       INITIALIZE AUTH
    ----------------------------------------- */

    async function initIDEONAuth() {

        try {

            await loadSupabase();


            window.ideonSupabase =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_PUBLISHABLE_KEY
                );


            addAuthStyles();


            const {

                data: {
                    session
                }

            } =
                await window
                    .ideonSupabase
                    .auth
                    .getSession();


            if (
                session &&
                session.user
            ) {

                renderLoggedIn(
                    session.user
                );

            } else {

                renderLoggedOut();
            }


            /* WATCH FOR LOGIN / LOGOUT */

            window
                .ideonSupabase
                .auth
                .onAuthStateChange(
                    function (
                        _event,
                        newSession
                    ) {

                        if (
                            newSession &&
                            newSession.user
                        ) {

                            renderLoggedIn(
                                newSession.user
                            );

                        } else {

                            renderLoggedOut();
                        }
                    }
                );


        } catch (error) {

            console.error(
                "IDEON auth initialization error:",
                error
            );
        }
    }


    /* -----------------------------------------
       START
    ----------------------------------------- */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initIDEONAuth
        );

    } else {

        initIDEONAuth();
    }

})();
