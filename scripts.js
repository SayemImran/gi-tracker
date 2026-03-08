let allIssues = [];
let activeFilter = "all";

// login feature 
const checker = (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    window.location.href = "./issueList.html";
  } else {
    alert("Credential Error");
  }
};

const priorityClasses = {
  low: "text-gray-500 bg-gray-100",
  medium: "text-yellow-600 bg-yellow-100",
  high: "text-red-500 bg-red-100",
};

const labelClasses = {
  bug: "bg-red-100 text-red-400 font-semibold",
  enhancement: "bg-green-100 text-green-400 font-semibold",
  default: "bg-blue-200",
};

// ── Modal part
const openModal = (issue) => {
  const modal = document.getElementById("issue-modal");
  const statusBadge =
    issue.status === "closed"
      ? `<span class="px-4 py-1 text-sm font-semibold bg-red-500 text-white rounded-full">Closed</span>`
      : `<span class="px-4 py-1 text-sm font-semibold bg-green-500 text-white rounded-full">Opened</span>`;

  const priorityBadgeClass =
    issue.priority === "high"
      ? "bg-red-500 text-white"
      : issue.priority === "medium"
        ? "bg-yellow-400 text-white"
        : "bg-gray-300 text-gray-700";

  const labelIcons = {
    bug: "⚠️",
    enhancement: "🚀",
    "help wanted": "🙋",
    default: "🏷️",
  };

  document.getElementById("modal-content").innerHTML = `
    <div class="p-6">

      <!-- Title -->
      <h2 class="text-2xl font-bold text-gray-900 mb-3">${issue.title}</h2>

      <!-- Status + meta row -->
      <div class="flex items-center gap-2 flex-wrap mb-4">
        ${statusBadge}
        <span class="text-gray-400 text-sm">•</span>
        <span class="text-gray-500 text-sm">Opened by <span class="font-medium text-gray-700">${issue.author}</span></span>
        <span class="text-gray-400 text-sm">•</span>
        <span class="text-gray-500 text-sm">${new Date(issue.createdAt).toLocaleDateString("en-GB")}</span>
      </div>

      <!-- Labels -->
      <div class="flex flex-wrap gap-2 mb-5">
        ${issue.labels
          .map((label) => {
            const icon = labelIcons[label.toLowerCase()] || labelIcons.default;
            const cls =
              labelClasses[label] || "bg-blue-100 text-blue-500 font-semibold";
            return `<span class="px-3 py-1 text-xs ${cls} rounded-full border border-current/20">${icon} ${label.toUpperCase()}</span>`;
          })
          .join("")}
      </div>

      <!-- Description -->
      <p class="text-gray-600 text-sm leading-relaxed mb-6">
        ${issue.description || "<span class='text-gray-400 italic'>No description provided.</span>"}
      </p>

      <!-- Assignee + Priority card -->
      <div class="bg-gray-50 rounded-xl px-6 py-4 flex items-center justify-between mb-6">
        <div>
          <p class="text-sm text-gray-400 mb-1">Assignee:</p>
          <p class="font-bold text-gray-800">${issue.author}</p>
        </div>
        <div>
          <p class="text-sm text-gray-400 mb-1">Priority:</p>
          <span class="px-4 py-1.5 text-sm font-bold ${priorityBadgeClass} rounded-full">
            ${issue.priority.toUpperCase()}
          </span>
        </div>
      </div>

      <!-- Close button -->
      <div class="flex justify-end">
        <button id="close-modal-btn" class="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors duration-150">
          Close
        </button>
      </div>

    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";

  // Close button inside modal
  document
    .getElementById("close-modal-btn")
    .addEventListener("click", closeModal);
};

const closeModal = () => {
  const modal = document.getElementById("issue-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
};

// load all issue from the API
const loadAllIssues = (issues) => {
  const issueContainer = document.getElementById("issue-container");
  issueContainer.innerHTML = "";

  if (issues.length === 0) {
    issueContainer.innerHTML = `
      <div class="col-span-4 text-center py-16 text-gray-400">
        <i class="fa fa-search text-4xl mb-3 block"></i>
        <p class="text-lg font-medium">No issues found</p>
        <p class="text-sm">Try a different search term</p>
      </div>
    `;
    return;
  }

  issues.forEach((issue) => {
    const priorityClass =
      priorityClasses[issue.priority] || "bg-gray-100 text-gray-500";

    const priorityImg =
      issue.status === "closed"
        ? `<img src="./assets/Closed- Status .png" alt="Closed" />`
        : `<img src="./assets/Open-Status.png" alt="Open" />`;

    const borderStyle =
      issue.priority === "low" ? "border-violet-500" : "border-green-500";

    const issueDiv = document.createElement("div");
    issueDiv.innerHTML = `
      <div class="max-w-sm rounded-xl border-t-2 ${borderStyle} bg-white overflow-hidden mb-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200" data-issue-id="${issue.id}">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 flex items-center justify-center rounded-full">
              ${priorityImg}
            </div>
            <span class="px-4 py-1 text-sm font-semibold ${priorityClass} rounded-full">
              ${issue.priority.toUpperCase()}
            </span>
          </div>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">${issue.title}</h2>
          <p class="text-gray-500 text-sm mb-4 [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">${issue.description}</p>
          <div class="flex gap-3 mb-4 flex-wrap">
            ${issue.labels
              .map(
                (label) =>
                  `<span class="px-3 py-1 text-xs ${labelClasses[label] || labelClasses.default} rounded-full text-center">${label.toUpperCase()}</span>`,
              )
              .join("")}
          </div>
        </div>
        <div class="border-t px-6 py-3 text-sm text-gray-500 flex flex-col gap-2 justify-center">
          <span>#${issue.id} by ${issue.author}</span>
          <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    `;

    // Attach click handler to the card
    issueDiv.querySelector("[data-issue-id]").addEventListener("click", () => {
      openModal(issue);
    });

    issueContainer.appendChild(issueDiv);
  });
};

// ── search filter applied here
const applyFilters = () => {
  const searchInput = document.getElementById("issue-search");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  let filtered = allIssues;

  if (activeFilter !== "all") {
    filtered = filtered.filter((issue) => issue.status === activeFilter);
  }

  if (query) {
    filtered = filtered.filter((issue) => {
      return (
        issue.title?.toLowerCase().includes(query) ||
        issue.description?.toLowerCase().includes(query) ||
        issue.author?.toLowerCase().includes(query) ||
        issue.priority?.toLowerCase().includes(query) ||
        issue.status?.toLowerCase().includes(query) ||
        issue.labels?.some((label) => label.toLowerCase().includes(query))
      );
    });
  }

  loadAllIssues(filtered);
};

const setActiveButton = (activeId) => {
  const buttons = ["btn-all", "btn-open", "btn-closed"];
  buttons.forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    if (id === activeId) {
      btn.classList.remove(
        "bg-transparent",
        "text-gray-500",
        "border-gray-300",
        "shadow-none",
      );
      btn.classList.add("bg-primary", "text-white", "border-primary");
    } else {
      btn.classList.add(
        "bg-transparent",
        "text-gray-500",
        "border-gray-300",
        "shadow-none",
      );
      btn.classList.remove("bg-primary", "text-white", "border-primary");
    }
  });
};

const displayIssue = () => {
  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      allIssues = data.data;
      const countEl = document.getElementById("total-issue-count");
      if (countEl) countEl.innerHTML = `${allIssues.length} Issues`;
      applyFilters();
    })
    .catch((err) => console.error("Error fetching issues:", err));
};

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("issue-search");
  if (searchInput) searchInput.addEventListener("input", () => applyFilters());

  document.getElementById("btn-all")?.addEventListener("click", () => {
    activeFilter = "all";
    setActiveButton("btn-all");
    applyFilters();
  });

  document.getElementById("btn-open")?.addEventListener("click", () => {
    activeFilter = "open";
    setActiveButton("btn-open");
    applyFilters();
  });

  document.getElementById("btn-closed")?.addEventListener("click", () => {
    activeFilter = "closed";
    setActiveButton("btn-closed");
    applyFilters();
  });

  setActiveButton("btn-all");

  // Close modal on backdrop click
  document.getElementById("issue-modal")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("issue-modal")) closeModal();
  });

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});

displayIssue();
