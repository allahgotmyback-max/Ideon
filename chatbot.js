/* =========================================================
   IDEON AI CHATBOT
   ========================================================= */

(() => {

    const SUPABASE_FUNCTION_URL =
        "https://ceedwhwnpthqdzhtkemy.supabase.co/functions/v1/ask-ideon";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_bGc_PDepTuhmmvVG1WMPUQ_-MlnP8hO";


    const button =
        document.getElementById(
            "ideonAIButton"
        );

    const chat =
        document.getElementById(
            "ideonChat"
        );

    const close =
        document.getElementById(
            "ideonChatClose"
        );

    const messages =
        document.getElementById(
            "ideonChatMessages"
        );

    const input =
        document.getElementById(
            "ideonChatInput"
        );

    const send =
        document.getElementById(
            "ideonChatSend"
        );


    if (
        !button ||
        !chat ||
        !messages ||
        !input ||
        !send
    ) {

        return;

    }


    /* =====================================================
       OPEN / CLOSE
       ===================================================== */

    button.addEventListener(
        "click",
        () => {

            chat.classList.toggle(
                "open"
            );

            if (
                chat.classList.contains(
                    "open"
                )
            ) {

                setTimeout(
                    () =>
                        input.focus(),
                    150
                );

            }

        }
    );


    close?.addEventListener(
        "click",
        () => {

            chat.classList.remove(
                "open"
            );

        }
    );


    /* =====================================================
       ADD MESSAGE
       ===================================================== */

    function addMessage(
        text,
        type
    ) {

        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            `ideon-message ${type}`;


        const avatar =
            document.createElement(
                "div"
            );

        avatar.className =
            "message-avatar";

        avatar.textContent =
            type === "ai"
                ? "✦"
                : "YOU";


        const bubble =
            document.createElement(
                "div"
            );

        bubble.className =
            "message-bubble";


        /*
         Keep AI text safe.
         Convert line breaks to <br>.
        */

        bubble.innerHTML =
            escapeHTML(text)
                .replace(
                    /\n/g,
                    "<br>"
                );


        wrapper.appendChild(
            avatar
        );

        wrapper.appendChild(
            bubble
        );


        messages.appendChild(
            wrapper
        );


        messages.scrollTop =
            messages.scrollHeight;

    }


    /* =====================================================
       HTML ESCAPE
       ===================================================== */

    function escapeHTML(text) {

        return String(text)

            .replaceAll(
                "&",
                "&amp;"
            )

            .replaceAll(
                "<",
                "&lt;"
            )

            .replaceAll(
                ">",
                "&gt;"
            )

            .replaceAll(
                '"',
                "&quot;"
            )

            .replaceAll(
                "'",
                "&#039;"
            );

    }


    /* =====================================================
       TYPING INDICATOR
       ===================================================== */

    function addTyping() {

        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "ideon-message ai";

        wrapper.id =
            "ideonTyping";


        wrapper.innerHTML = `

            <div class="message-avatar">
                ✦
            </div>

            <div class="message-bubble">
                IDEON AI is thinking...
            </div>

        `;


        messages.appendChild(
            wrapper
        );


        messages.scrollTop =
            messages.scrollHeight;

    }


    function removeTyping() {

        document
            .getElementById(
                "ideonTyping"
            )
            ?.remove();

    }


    /* =====================================================
       ASK AI
       ===================================================== */

    async function askIDEON(question) {

        addMessage(
            question,
            "user"
        );

        input.value = "";

        addTyping();


        try {

            const response =
                await fetch(
                    SUPABASE_FUNCTION_URL,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "apikey":
                                SUPABASE_PUBLISHABLE_KEY,

                            "Authorization":
                                `Bearer ${SUPABASE_PUBLISHABLE_KEY}`

                        },

                        body:
                            JSON.stringify({

                                action:
                                    "chat",

                                message:
                                    question

                            })

                    }
                );


            const data =
                await response.json();


            removeTyping();


            if (
                !response.ok
            ) {

                throw new Error(
                    data?.error ||
                    "AI request failed."
                );

            }


            const answer =

                data.answer ||

                data.response ||

                data.message ||

                data.result ||

                data.text;


            if (!answer) {

                throw new Error(
                    "No AI response received."
                );

            }


            addMessage(
                answer,
                "ai"
            );


        } catch (error) {

            console.error(
                "IDEON AI:",
                error
            );


            removeTyping();


            addMessage(

                "Sorry, I couldn't connect to IDEON AI right now. Please try again.",

                "ai"

            );

        }

    }


    /* =====================================================
       SEND
       ===================================================== */

    async function sendMessage() {

        const question =
            input.value.trim();


        if (!question) return;


        send.disabled =
            true;


        await askIDEON(
            question
        );


        send.disabled =
            false;


        input.focus();

    }


    send.addEventListener(
        "click",
        sendMessage
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
                &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    /* =====================================================
       QUICK QUESTIONS
       ===================================================== */

    document
        .querySelectorAll(
            ".ideon-suggestions button"
        )
        .forEach(
            suggestion => {

                suggestion.addEventListener(

                    "click",

                    () => {

                        const question =
                            suggestion.dataset.question;

                        if (!question)
                            return;

                        input.value =
                            question;

                        sendMessage();

                    }

                );

            }
        );


})();
