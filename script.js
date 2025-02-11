document.addEventListener("DOMContentLoaded", function () {
    const img = document.querySelector(".object_astronaut");
    let x = 10, y = 10; // Initial position
    let dx = 2, dy = 2; // Speed

    function moveImage() {
        const container = document.querySelector(".container");
        const imgWidth = img.clientWidth;
        const imgHeight = img.clientHeight;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        x += dx;
        y += dy;

        if (x + imgWidth >= containerWidth || x <= 0) {
            dx *= -1; // Reverse direction
        }
        if (y + imgHeight >= containerHeight || y <= 0) {
            dy *= -1;
        }

        img.style.left = x + "px";
        img.style.top = y + "px";

        requestAnimationFrame(moveImage);
    }

    moveImage();
});






document.addEventListener("DOMContentLoaded", function () {
    // Show the spinner
    function showSpinner() {
        const loadingOverlay = document.getElementById("loadingOverlay");
        if (loadingOverlay) {
            loadingOverlay.style.display = "flex"; // Make the spinner visible
        }
    }

    // Hide the spinner
    function hideSpinner() {
        const loadingOverlay = document.getElementById("loadingOverlay");
        if (loadingOverlay) {
            loadingOverlay.style.display = "none"; // Hide the spinner
        }
    }

    // CORS Proxy URL to bypass CORS issues
    const proxy = "https://api.allorigins.win/get?url=";

    // Fetch content from the target URL
    async function fetchContent(url) {
        try {
            showSpinner(); // Show spinner when fetching starts
            const response = await fetch(proxy + encodeURIComponent(url));
            if (!response.ok) throw new Error("Failed to fetch the URL.");
            const data = await response.json();
            return data.contents; // Return the raw HTML as string
        } catch (error) {
            console.error("Error fetching content:", error);
            return null;
        } finally {
            hideSpinner(); // Always hide the spinner after fetch completes
        }
    }

    // Display output in the output div
    function displayOutput(content) {
        const outputDiv = document.getElementById("output");
        if (outputDiv) {
            outputDiv.innerHTML = content;
        }
    }

    // Scrape paragraphs
    async function scrapeParagraphs() {
        const url = document.getElementById("urlInput").value.trim();
        if (!url) {
            alert("Please paste a valid URL.");
            return;
        }

        const html = await fetchContent(url);
        if (!html) return;

        const doc = new DOMParser().parseFromString(html, "text/html");
        const paragraphs = Array.from(doc.querySelectorAll("p")).map(p => p.textContent.trim());
        if (paragraphs.length) {
            displayOutput("<h3>Scraped Paragraphs:</h3><ul>" +
                paragraphs.map(p => `<li>${p}</li>`).join("") +
                "</ul>");
        } else {
            displayOutput("<p>No paragraphs found on the page.</p>");
        }
    }

    // Scrape links
    async function scrapeLinks() {
        const url = document.getElementById("urlInput").value.trim();
        if (!url) {
            alert("Please paste a valid URL.");
            return;
        }

        const html = await fetchContent(url);
        if (!html) return;

        const doc = new DOMParser().parseFromString(html, "text/html");
        const links = Array.from(doc.querySelectorAll("a[href]")).map(a => ({
            text: a.textContent.trim(),
            href: a.href
        }));

        if (links.length) {
            displayOutput("<h3>Scraped Links:</h3><ul>" +
                links.map(link =>
                    `<li><a href="${link.href}" target="_blank">${link.text || link.href}</a></li>`
                ).join("") +
                "</ul>");
        } else {
            displayOutput("<p>No links found on the page.</p>");
        }
    }

    // Scrape images
    async function scrapeImages() {
        const url = document.getElementById("urlInput").value.trim();
        if (!url) {
            alert("Please paste a valid URL.");
            return;
        }

        const html = await fetchContent(url);
        if (!html) return;

        const doc = new DOMParser().parseFromString(html, "text/html");
        const images = Array.from(doc.querySelectorAll("img")).map(img => ({
            src: img.src,
            alt: img.alt || "No description"
        }));

        if (images.length) {
            displayOutput("<h3>Scraped Images:</h3>" +
                images.map(img =>
                    `<div><img src="${img.src}" alt="${img.alt}" style="max-width: 300px;"><p>${img.alt}</p></div>`
                ).join(""));
        } else {
            displayOutput("<p>No images found on the page.</p>");
        }
    }

    // Scrape full HTML
    async function scrapeFullHTML() {
        const url = document.getElementById("urlInput").value.trim();
        if (!url) {
            alert("Please paste a valid URL.");
            return;
        }

        const html = await fetchContent(url);
        if (!html) return;

        // Display full HTML inside a preformatted block (escape HTML tags)
        displayOutput("<h3>Scraped Full HTML:</h3><pre>" +
            html.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
            "</pre>");
    }

    // Attach event listeners to the buttons
    const btnParagraphs = document.getElementById("scrapeParagraphs");
    const btnLinks = document.getElementById("scrapeLinks");
    const btnImages = document.getElementById("scrapeImages");
    const btnFullHTML = document.getElementById("scrapeFullHTML");

    if (btnParagraphs) btnParagraphs.addEventListener("click", scrapeParagraphs);
    if (btnLinks) btnLinks.addEventListener("click", scrapeLinks);
    if (btnImages) btnImages.addEventListener("click", scrapeImages);
    if (btnFullHTML) btnFullHTML.addEventListener("click", scrapeFullHTML);
});





