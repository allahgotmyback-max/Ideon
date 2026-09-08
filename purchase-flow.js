/* =========================================
   IDEON PURCHASE FLOW
   Logged in  -> direct checkout
   Logged out -> signup -> checkout
   ========================================= */

(function () {
    const SUPABASE_URL =
        "https://ceedwhwnpthqdzhtkemy.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_bGc_PDepTuhmmvVG1WMPUQ_-MlnP8hO";

    function goToPurchase(plan) {
        const cleanPlan = String(plan || "pro").toLowerCase();

        if (cleanPlan === "free") {
            window.location.href = "signup.html?plan=free";
            return;
        }

        window.location.href =
            `checkout.html?plan=${encodeURIComponent(cleanPlan)}`;
    }

    async function initPurchaseButtons() {
        if (!window.supabase) return;

        const client = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );

        const {
            data: { session }
        } = await client.auth.getSession();

        document.querySelectorAll("[data-ideon-purchase]").forEach(button => {
            const plan = button.dataset.ideonPurchase;

            button.addEventListener("click", function (event) {
                event.preventDefault();

                /*
                 * Both logged-in and logged-out users go to checkout first.
                 * checkout.html itself checks the session:
                 *
                 * LOGGED IN  -> checkout directly
                 * LOGGED OUT -> signup, then back to checkout
                 */
                goToPurchase(plan);
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPurchaseButtons);
    } else {
        initPurchaseButtons();
    }
})();
