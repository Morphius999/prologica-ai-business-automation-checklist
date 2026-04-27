const checklistData = [
  {
    category: "Repetitive Workflows",
    items: [
      "Identify recurring tasks that follow the same steps each time.",
      "List manual workflows that consume staff time every week.",
      "Document tasks where employees copy information between systems.",
      "Decide which repetitive workflows are safe to automate first."
    ]
  },
  {
    category: "Customer Support",
    items: [
      "List common customer questions and support requests.",
      "Identify support responses that can be drafted or suggested by AI.",
      "Document when a support issue must be escalated to a person.",
      "Decide which customer channels could use AI assistance."
    ]
  },
  {
    category: "Lead Intake and Sales Follow-Up",
    items: [
      "Identify how new leads currently enter the business.",
      "List lead qualification questions that could be handled automatically.",
      "Document follow-up messages that should be personalized.",
      "Decide when sales staff should review or take over from AI."
    ]
  },
  {
    category: "Document Processing",
    items: [
      "List documents that require manual reading or data extraction.",
      "Identify forms, contracts, invoices, or records with repeatable fields.",
      "Document document review steps that require human approval.",
      "Decide which extracted data should move into other systems."
    ]
  },
  {
    category: "Email and Communication",
    items: [
      "List email types that are repetitive or template-based.",
      "Identify messages where AI could draft a first response.",
      "Document tone, brand, and approval requirements for outbound messages.",
      "Decide which messages should never be sent without human review."
    ]
  },
  {
    category: "Reporting and Data Insights",
    items: [
      "List reports that are manually created or interpreted.",
      "Identify metrics where plain-language summaries would help.",
      "Document decisions that depend on reviewing dashboards or exports.",
      "Decide which insights should trigger alerts or next steps."
    ]
  },
  {
    category: "Internal Knowledge Management",
    items: [
      "List internal policies, procedures, and reference documents.",
      "Identify questions employees repeatedly ask about operations.",
      "Document which knowledge sources should be searchable by AI.",
      "Decide who should maintain and approve internal knowledge content."
    ]
  },
  {
    category: "CRM and Business Systems",
    items: [
      "Identify CRM records that need summaries, updates, or follow-ups.",
      "List business systems where AI-generated notes could save time.",
      "Document fields or records that AI should never change automatically.",
      "Decide where human confirmation is required before updates."
    ]
  },
  {
    category: "Task Routing and Approvals",
    items: [
      "List tasks that need to be routed to the right person or team.",
      "Identify approval workflows where AI could prepare context.",
      "Document rules for assigning priority or urgency.",
      "Decide which approvals require final human decision-making."
    ]
  },
  {
    category: "Security and Human Review",
    items: [
      "Identify sensitive data that AI tools may need to handle.",
      "Document where human review is required before action is taken.",
      "Decide what data should be excluded from AI workflows.",
      "List security controls needed for AI access and activity logs."
    ]
  },
  {
    category: "Integration Readiness",
    items: [
      "List systems that AI automation would need to read from or write to.",
      "Identify APIs, databases, forms, or exports that are available today.",
      "Document where disconnected tools create manual handoffs.",
      "Decide which integrations are required for a useful first version."
    ]
  },
  {
    category: "AI Governance and Accuracy",
    items: [
      "Define what accurate AI output means for each use case.",
      "Identify risks from incorrect, outdated, or incomplete responses.",
      "Document who will review AI performance and edge cases.",
      "Decide how AI behavior should be tested before launch."
    ]
  }
];

const STORAGE_KEY = "prologicaAiBusinessAutomationChecklist";

const checklistEl = document.getElementById("checklist");
const progressPercentageEl = document.getElementById("progressPercentage");
const progressFillEl = document.getElementById("progressFill");
const readinessLevelEl = document.getElementById("readinessLevel");
const resetButton = document.getElementById("resetButton");

function getSavedState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getItemId(categoryIndex, itemIndex) {
  return `ai-automation-item-${categoryIndex}-${itemIndex}`;
}

function renderChecklist() {
  const savedState = getSavedState();

  checklistData.forEach((group, categoryIndex) => {
    const card = document.createElement("article");
    card.className = "category-card";

    const heading = document.createElement("h2");
    heading.textContent = group.category;

    const list = document.createElement("ul");
    list.className = "checklist-items";

    group.items.forEach((item, itemIndex) => {
      const itemId = getItemId(categoryIndex, itemIndex);
      const listItem = document.createElement("li");
      listItem.className = "checklist-item";

      const label = document.createElement("label");
      label.setAttribute("for", itemId);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = itemId;
      checkbox.checked = Boolean(savedState[itemId]);

      const labelText = document.createElement("span");
      labelText.textContent = item;

      label.append(checkbox, labelText);
      listItem.appendChild(label);
      list.appendChild(listItem);
    });

    card.append(heading, list);
    checklistEl.appendChild(card);
  });
}

function updateProgress() {
  const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
  const checkedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
  const percentage = checkboxes.length ? Math.round((checkedCount / checkboxes.length) * 100) : 0;

  progressPercentageEl.textContent = `${percentage}%`;
  progressFillEl.style.width = `${percentage}%`;

  readinessLevelEl.classList.remove("readiness-low", "readiness-medium", "readiness-high");

  if (percentage < 40) {
    readinessLevelEl.textContent = "Early AI Exploration Stage";
    readinessLevelEl.classList.add("readiness-low");
  } else if (percentage < 70) {
    readinessLevelEl.textContent = "Needs More Workflow Clarity";
    readinessLevelEl.classList.add("readiness-medium");
  } else {
    readinessLevelEl.textContent = "Ready for AI Automation Discovery";
    readinessLevelEl.classList.add("readiness-high");
  }
}

function handleChecklistChange(event) {
  if (event.target.type !== "checkbox") {
    return;
  }

  const savedState = getSavedState();
  savedState[event.target.id] = event.target.checked;
  saveState(savedState);
  updateProgress();
}

function resetChecklist() {
  localStorage.removeItem(STORAGE_KEY);
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
  updateProgress();
}

renderChecklist();
updateProgress();

checklistEl.addEventListener("change", handleChecklistChange);
resetButton.addEventListener("click", resetChecklist);
