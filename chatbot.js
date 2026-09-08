/* =========================================================
   IDEON AI CHATBOT
   ========================================================= */

(() => {

    const SUPABASE_FUNCTION_URL =
        "https://ceedwhwnpthqdzhtkemy.supabase.co/functions/v1/ask-ideon";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_bGc_PDepTuhmmvVG1WMPUQ_-MlnP8hO";


    const button =
        document.getElementById("ideonAIButton");

    const chat =
        document.getElementById("ideonChat");

    const close =
        document.getElementById("ideonChatClose");

    const messagesBox =
        document.getElementById("ideonChatMessages");

    const input =
        document.getElementById("ideonChatInput");

    const send =
        document.getElementById("ideonChatSend");


    if (
        !button ||
        !chat ||
        !messagesBox ||
        !input ||
        !send
    ) {
        return;
    }


    /* =====================================================
       CONVERSATION MEMORY
       ===================================================== */

    const conversation = [];


    /* =====================================================
       OPEN / CLOSE
       ===================================================== */

    button.addEventListener("click", () => {

        chat.classList.toggle("open");

        if (chat.classList.contains("open")) {

            setTimeout(() => {
                input.focus();
            }, 150);

        }

    });


    if (close) {

        close.addEventListener("click", () => {

            chat.classList.remove("open");

        });

    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(text) {

        return String(text)

            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /* =====================================================
       ADD MESSAGE TO SCREEN
       ===================================================== */

   /* =====================================================
   ADD MESSAGE TO SCREEN
   ===================================================== */

function addMessage(text, type) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        `ideon-message ${type}`;


    const avatar =
        document.createElement("div");

    avatar.className =
        "message-avatar";


    if (type === "ai") {

        const logo =
            document.createElement("img");

        logo.src =
            "ideon-icon.png";

        logo.alt =
            "IDEON";

        logo.className =
            "chat-avatar";

        avatar.appendChild(logo);

    } else {

        avatar.textContent =
            "YOU";

    }


    const bubble =
        document.createElement("div");

    bubble.className =
        "message-bubble";


    bubble.innerHTML =
        escapeHTML(text)
            .replace(/\n/g, "<br>");


    /*
     AI:
     [IDEON LOGO] [MESSAGE]

     USER:
     [MESSAGE] [YOU]
    */

    if (type === "ai") {

        wrapper.appendChild(avatar);
        wrapper.appendChild(bubble);

    } else {

        wrapper.appendChild(bubble);
        wrapper.appendChild(avatar);

    }


    messagesBox.appendChild(wrapper);


    messagesBox.scrollTop =
        messagesBox.scrollHeight;

}

    /* =====================================================
       TYPING INDICATOR
       ===================================================== */

    function showTyping() {

        const wrapper =
            document.createElement("div");

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


        messagesBox.appendChild(wrapper);


        messagesBox.scrollTop =
            messagesBox.scrollHeight;

    }


    function hideTyping() {

        const typing =
            document.getElementById(
                "ideonTyping"
            );

        if (typing) {
            typing.remove();
        }

    }


    /* =====================================================
       ASK IDEON AI
       ===================================================== */

    async function askIDEON(question) {

        addMessage(
            question,
            "user"
        );


        /*
         Add the user's question
         to conversation history.
        */

        conversation.push({

            role: "user",

            content: question

        });


        /*
         Keep the conversation small
         so the AI doesn't receive
         unlimited history.
        */

        const recentConversation =
            conversation.slice(-12);


        input.value = "";


        showTyping();


        try {

            const response =
                await fetch(
                    SUPABASE_FUNCTION_URL,
                    {

                        method: "POST",

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

                                /*
                                 THIS is the important fix.
                                 Your Supabase function expects
                                 an array called "messages".
                                */

                                messages:
                                    recentConversation

                            })

                    }
                );


            const data =
                await response.json();


            hideTyping();


            if (!response.ok) {

                console.error(
                    "IDEON AI ERROR:",
                    data
                );

                throw new Error(
                    data?.error ||
                    "AI request failed."
                );

            }


            const answer =
                data?.answer;


            if (!answer) {

                throw new Error(
                    "IDEON AI returned no answer."
                );

            }


            /*
             Add AI response to
             conversation memory.
            */

            conversation.push({

                role: "assistant",

                content: answer

            });


            addMessage(
                answer,
                "ai"
            );


        } catch (error) {

            console.error(
                "IDEON AI:",
                error
            );


            hideTyping();


            addMessage(

                "Sorry, I couldn't connect to IDEON AI right now. Please try again.",

                "ai"

            );

        }

    }


    /* =====================================================
       SEND MESSAGE
       ===================================================== */

    async function sendMessage() {

        const question =
            input.value.trim();


        if (!question) {
            return;
        }


        send.disabled = true;

        input.disabled = true;


        await askIDEON(question);


        send.disabled = false;

        input.disabled = false;


        input.focus();

    }


    /* =====================================================
       SEND BUTTON
       ===================================================== */

    send.addEventListener(
        "click",
        sendMessage
    );


    /* =====================================================
       ENTER TO SEND
       ===================================================== */

    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
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


                        if (!question) {
                            return;
                        }


                        input.value =
                            question;


                        sendMessage();

                    }
                );

            }
        );


})();
