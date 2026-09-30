document.addEventListener("DOMContentLoaded", () => {

    const projects = [
        {
            title: "Resonant Monolith",
            url: "resonant-monolith.html"
        },
        {
            title: "A New Sense of Arrival",
            url: "A new sense of arrival.html"
        },
        {
            title: "Belvedere Vlorë",
            url: "Belvedere.html"
        },
        {
            title: "Eduhabitat",
            url: "Eduhabitat.html"
        },
        {
            title: "Terrace House",
            url: "Terrace House.html"
        },
        {
            title: "BRILANT Hotels in Qerret",
            url: "Qerret.html"
        },
        {
            title: "Memories Plug-In",
            url: "memories-plugin.html"
        }
    
        
        
    ];


    // Get current HTML filename
    const currentPage = decodeURIComponent(
        window.location.pathname.split("/").pop()
    );


    // Find current project
    const currentIndex = projects.findIndex(
        project =>
            project.url.toLowerCase() === currentPage.toLowerCase()
    );


    const navigation =
        document.querySelector(".project-navigation");


    console.log("Current page:", currentPage);
    console.log("Current project index:", currentIndex);


    if (!navigation || currentIndex === -1) {
        return;
    }


    const previousProject =
        projects[currentIndex - 1];

    const nextProject =
        projects[currentIndex + 1];


    // PREVIOUS PROJECT
    if (previousProject) {

        const previousLink =
            document.createElement("a");

        previousLink.className =
            "project-nav-link project-nav-prev";

        previousLink.href =
            previousProject.url;

        previousLink.innerHTML = `
            <span class="project-nav-arrow">‹</span>

            <span class="project-nav-title">
                ${previousProject.title}
            </span>
        `;

        navigation.appendChild(previousLink);
    }


    // NEXT PROJECT
    if (nextProject) {

        const nextLink =
            document.createElement("a");

        nextLink.className =
            "project-nav-link project-nav-next";

        nextLink.href =
            nextProject.url;

        nextLink.innerHTML = `
            <span class="project-nav-title">
                ${nextProject.title}
            </span>

            <span class="project-nav-arrow">›</span>
        `;

        navigation.appendChild(nextLink);
    }

});