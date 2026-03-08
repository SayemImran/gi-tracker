let allIssues = [];
let activeFilter = "all"; // track current status filter

const checker = (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    alert("Success!!");
    window.location.href = "./issueList.html";
  } else {
    alert("Credential Error");
  }
};

// Map of priority styles
const priorityClasses = {
  low: "text-gray-500 bg-gray-100",
  medium: "text-yellow-600 bg-yellow-100",
  high: "text-red-500 bg-red-100",
};

// Map of label styles
const labelClasses = {
  bug: "bg-red-100 text-red-400 font-semibold",
  enhancement: "bg-green-100 text-green-400 font-semibold",
  default: "bg-blue-200",
};

const renderIssues = (issues) => {
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
      <div class="max-w-sm rounded-xl border-t-2 ${borderStyle} bg-white overflow-hidden mb-5">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 flex items-center justify-center rounded-full">
              ${priorityImg}
            </div>
            <span class="px-4 py-1 text-sm font-semibold ${priorityClass} rounded-full">
              ${issue.priority.toUpperCase()}
            </span>
          </div>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">
            ${issue.title}
          </h2>
          <p class="text-gray-500 text-sm mb-4">
            ${issue.description}
          </p>
          <div class="flex gap-3 mb-4 flex-wrap">
            ${issue.labels
              .map(
                (label) =>
                  `<span class="px-3 py-1 text-xs ${labelClasses[label] || labelClasses.default} rounded-full text-center">
                    ${label.toUpperCase()}
                  </span>`,
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

    issueContainer.appendChild(issueDiv);
  });
};

// Apply both status filter and search query together
const applyFilters = () => {
  const searchInput = document.getElementById("issue-search");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  let filtered = allIssues;

  // Apply status filter first
  if (activeFilter !== "all") {
    filtered = filtered.filter((issue) => issue.status === activeFilter);
  }

  // Then apply search query on top
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

  renderIssues(filtered);
};

// Update active button styles
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
      applyFilters();
    })
    .catch((err) => console.error("Error fetching issues:", err));
};

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("issue-search");

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener("input", () => applyFilters());
  }

  // All button
  document.getElementById("btn-all")?.addEventListener("click", () => {
    activeFilter = "all";
    setActiveButton("btn-all");
    applyFilters();
  });

  // Open button
  document.getElementById("btn-open")?.addEventListener("click", () => {
    activeFilter = "open";
    setActiveButton("btn-open");
    applyFilters();
  });

  // Closed button
  document.getElementById("btn-closed")?.addEventListener("click", () => {
    activeFilter = "closed";
    setActiveButton("btn-closed");
    applyFilters();
  });

  // Set default active button
  setActiveButton("btn-all");
});

displayIssue();
