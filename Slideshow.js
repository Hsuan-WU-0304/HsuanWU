document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PLAN VIEWER
       Resonant Monolith masterplan / floor plans
    ===================================================== */

    const planViewer =
        document.querySelector(".plan-viewer:not(.render-viewer)");

    if (planViewer) {

        const plans = [
            {
                src: "Resonant-Monolith/IMAGE/GF.png",
                alt: "Resonant Monolith masterplan",
                name: "Masterplan"
            },
            {
                src: "Resonant-Monolith/IMAGE/+1050.png",
                alt: "Resonant Monolith second floor plan",
                name: "Second Floor"
            },
            {
                src: "Resonant-Monolith/IMAGE/+1650.png",
                alt: "Resonant Monolith third floor plan",
                name: "Third Floor"
            },
            {
                src: "Resonant-Monolith/IMAGE/+2500.png",
                alt: "Resonant Monolith fourth floor plan",
                name: "Fourth Floor"
            },
            {
                src: "Resonant-Monolith/IMAGE/B1F.png",
                alt: "Resonant Monolith basement plan",
                name: "B1 Floor"
            }
        ];

        const image =
            planViewer.querySelector(".plan-image");

        const label =
            planViewer.querySelector(".plan-label");

        const prev =
            planViewer.querySelector(".plan-arrow--prev");

        const next =
            planViewer.querySelector(".plan-arrow--next");

        let currentPlan = 0;


        function showPlan(index) {

            currentPlan =
                (index + plans.length) % plans.length;

            const plan = plans[currentPlan];

            image.src = plan.src;
            image.alt = plan.alt;

            if (label) {
                label.textContent =
                    `${String(currentPlan + 1).padStart(2, "0")} / ` +
                    `${String(plans.length).padStart(2, "0")} — ` +
                    plan.name;
            }
        }


        prev?.addEventListener(
            "click",
            () => showPlan(currentPlan - 1)
        );

        next?.addEventListener(
            "click",
            () => showPlan(currentPlan + 1)
        );


        showPlan(0);
    }

        /* =====================================================
       RENDER VIEWERS
       Universal — arbitrary filenames supported
    ===================================================== */

    const renderViewers =
        document.querySelectorAll(".render-viewer");

    renderViewers.forEach((renderViewer) => {

        const folder =
            renderViewer.dataset.renderFolder;

        const project =
            renderViewer.dataset.renderProject || "Project";

        if (!folder) {
            console.warn(
                "Render viewer requires data-render-folder."
            );
            return;
        }


        /* ---------------------------------------------
           NORMALIZE FOLDER
        --------------------------------------------- */

        const normalizedFolder =
            folder.endsWith("/")
                ? folder
                : `${folder}/`;


        /* ---------------------------------------------
           READ FILE NAMES FROM HTML
        --------------------------------------------- */

        const fileList =
            renderViewer.dataset.renderFiles
                ?.split(",")
                .map(file => file.trim())
                .filter(Boolean);


        let renders;


        /* =============================================
           MODE 1 — ARBITRARY FILENAMES
        ============================================= */

        if (fileList?.length) {

            renders = fileList.map((file, index) => ({

                src:
                    `${normalizedFolder}${file}`,

                alt:
                    `${project} render ${index + 1}`,

                name:
                    file.replace(/\.[^/.]+$/, "")
            }));

        }


        /* =============================================
           MODE 2 — OLD Render1.png SYSTEM
           Keeps Belvedere compatible
        ============================================= */

        else {

            const count =
                Number(renderViewer.dataset.renderCount);

            const extension =
                renderViewer.dataset.renderExtension || "png";

            if (!count) {
                console.warn(
                    "Render viewer requires data-render-files or data-render-count."
                );
                return;
            }

            renders = Array.from(
                { length: count },
                (_, index) => {

                    const number = index + 1;

                    return {
                        src:
                            `${normalizedFolder}Render${number}.${extension}`,

                        alt:
                            `${project} render ${number}`,

                        name:
                            `Render ${number}`
                    };
                }
            );
        }


        /* ---------------------------------------------
           ELEMENTS
        --------------------------------------------- */

        const image =
            renderViewer.querySelector(".plan-image");

        const label =
            renderViewer.querySelector(".plan-label");

        const thumbnailContainer =
            renderViewer.querySelector(".render-thumbnails");

        const prev =
            renderViewer.querySelector(".plan-arrow--prev");

        const next =
            renderViewer.querySelector(".plan-arrow--next");

        if (!image || !renders.length) return;


        let currentRender = 0;
        let thumbnails = [];


        /* ---------------------------------------------
           SHOW RENDER
        --------------------------------------------- */

        function showRender(index) {

            currentRender =
                (index + renders.length) % renders.length;

            const render =
                renders[currentRender];

            image.src =
                render.src;

            image.alt =
                render.alt;


            if (label) {

                label.textContent =
                    `${String(currentRender + 1).padStart(2, "0")} / ` +
                    `${String(renders.length).padStart(2, "0")} — ` +
                    render.name;
            }


            thumbnails.forEach(
                (button, buttonIndex) => {

                    const active =
                        buttonIndex === currentRender;

                    button.classList.toggle(
                        "is-active",
                        active
                    );

                    button.setAttribute(
                        "aria-pressed",
                        String(active)
                    );
                }
            );
        }


        /* =============================================
           THUMBNAILS
        ============================================= */

        if (thumbnailContainer) {

            thumbnailContainer.innerHTML = "";

            thumbnails = renders.map(
                (render, index) => {

                    const button =
                        document.createElement("button");

                    button.type =
                        "button";

                    button.setAttribute(
                        "aria-label",
                        `Show ${render.name}`
                    );

                    button.setAttribute(
                        "aria-pressed",
                        "false"
                    );


                    const thumbnail =
                        document.createElement("img");

                    thumbnail.src =
                        render.src;

                    thumbnail.alt =
                        "";

                    thumbnail.loading =
                        "lazy";


                    button.appendChild(thumbnail);


                    button.addEventListener(
                        "click",
                        () => showRender(index)
                    );


                    thumbnailContainer.appendChild(
                        button
                    );

                    return button;
                }
            );
        }


        /* =============================================
           ARROWS
        ============================================= */

        prev?.addEventListener(
            "click",
            () => showRender(currentRender - 1)
        );

        next?.addEventListener(
            "click",
            () => showRender(currentRender + 1)
        );


        /* =============================================
           INITIAL RENDER
        ============================================= */

        showRender(0);

    });

});