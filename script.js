const repositoryList = document.querySelector("#repository-list");
const statusMessage = document.querySelector("#status");

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium"
  }).format(date);
}

function renderRepositories(repositories) {
  repositoryList.replaceChildren();

  for (const repository of repositories) {
    const item = document.createElement("li");
    item.className = "repository";

    const link = document.createElement("a");
    link.href = repository.url;
    link.textContent = repository.name;

    const description = document.createElement("p");
    description.className = "repository-description";
    description.textContent = repository.description;

    const date = document.createElement("p");
    date.className = "repository-date";
    date.textContent = `Starred ${formatDate(repository.starredAt)}`;

    item.append(link, description, date);
    repositoryList.append(item);
  }

  statusMessage.textContent = repositories.length
    ? `${repositories.length} repositories`
    : "No starred repositories yet.";
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a JSON array.");
    }

    renderRepositories(repositories);
  } catch (error) {
    statusMessage.textContent = "Could not load starred repositories.";
    console.error("Failed to load events.json:", error);
  }
}

loadRepositories();
