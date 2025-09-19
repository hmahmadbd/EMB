// include-loader.js
async function includeHTML(file, elementId, callback) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);

        const text = await response.text();
        const placeholder = document.getElementById(elementId);

        if (placeholder) {
            placeholder.innerHTML = text;

            // ✅ Lucide icons render
            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }

            // ✅ Callback run after include
            if (callback && typeof callback === "function") {
                callback();
            }
        }
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
        const placeholder = document.getElementById(elementId);
        if (placeholder) {
            placeholder.innerHTML =
                `<div class="p-4 bg-red-100 text-red-600 text-center">⚠️ ${file} লোড করা যায়নি</div>`;
        }
    }
}

// ✅ Function to set up header/sidebar events
function setupHeaderAndSidebar() {
    const menuButton = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");
    const profileButton = document.getElementById("profileButton");
    const profileMenu = document.getElementById("profileMenu");
    const logoutButton = document.getElementById("logoutButton");

    let sidebarOpen = false;

    // Sidebar toggle
    if (menuButton && sidebar) {
        menuButton.addEventListener("click", () => {
            sidebarOpen = !sidebarOpen;
            sidebar.classList.toggle("-translate-x-full", !sidebarOpen);
        });
    }

    // Profile dropdown toggle
    if (profileButton && profileMenu) {
        profileButton.addEventListener("click", (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle("hidden");
        });
    }

    // ✅ Logout button (Use already initialized Firebase App)
    if (logoutButton) {
        logoutButton.addEventListener("click", async (e) => {
            e.preventDefault();
            try {
                if (!window.firebase || !firebase.auth) {
                    throw new Error("Firebase is not initialized in this page.");
                }
                await firebase.auth().signOut();
                window.location.href = "login.html"; 
            } catch (error) {
                console.error("Logout failed:", error);
                alert("Logout failed: " + error.message);
            }
        });
    }

    // Outside click → close sidebar/profile menu
    document.addEventListener("click", (e) => {
        if (
            profileButton &&
            profileMenu &&
            !profileButton.contains(e.target) &&
            !profileMenu.contains(e.target)
        ) {
            profileMenu.classList.add("hidden");
        }
        if (
            sidebar &&
            menuButton &&
            !sidebar.contains(e.target) &&
            !menuButton.contains(e.target)
        ) {
            sidebar.classList.add("-translate-x-full");
            sidebarOpen = false;
        }
    });
}