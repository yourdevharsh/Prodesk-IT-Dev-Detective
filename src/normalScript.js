import "./style.css";

document.addEventListener("DOMContentLoaded", async () => {
  const normalModeInputEl = document.querySelector("#normalMode input");
  const normalModeSearchBtn = document.querySelector("#normalMode button");

  const userAvatarEl = document.querySelector(".profileCard img");
  const userNameEl = document.querySelector(".profileCard .userName");
  const userBioEl = document.querySelector(".profileCard .userBio");
  const userJoinDateEl = document.querySelector(".profileCard .userJoinDate");
  const userPortfolioEl = document.querySelector(
    ".profileCard .userPortfolio",
  );
  const userLatestReposEl = document.querySelector(
    ".profileCard .userLatestRepos",
  );

  normalModeSearchBtn.addEventListener("click", async () => {
    if (normalModeInputEl.value.trim().length < 1) {
      return;
    }

    const usernameToSearch = normalModeInputEl.value.trim();

    try {
      document.getElementById("loadingBox").style.display = "flex";
      const {
        userAvatarUrl,
        userName,
        userBio,
        userJoinDate,
        userPortfolio,
        repoUrlToSearch,
      } = await fetchProfile(usernameToSearch);

      const latestRepos = await getLatestRepos(repoUrlToSearch);

      renderProfile(
        userAvatarUrl,
        userName,
        userBio,
        userJoinDate,
        userPortfolio,
        latestRepos,
      );
    } catch (error) {
      alert(error.message);
    } finally {
      document.getElementById("loadingBox").style.display = "none";
    }
  });

  /* UTILITY FUNCTIONS */
  async function fetchProfile(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User Not Found. Please Check Username.");
      } else {
        throw new Error("Something went wrong with API");
      }
    }

    const data = await response.json();
    return {
      userAvatarUrl: data["avatar_url"],
      userName: data["name"] || data["login"],
      userBio: data["bio"],
      userJoinDate: new Date(data["created_at"]),
      userPortfolio: data["blog"],
      repoUrlToSearch: data["repos_url"],
    };
  }

  async function fetchRepos(repoUrl) {
    try {
      const response = await fetch(repoUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }

  async function getLatestRepos(repoUrl) {
    const data = await fetchRepos(repoUrl);

    const sortedData = data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );

    const repos = sortedData
      .slice(0, 5)
      .map((repo) => [
        repo["name"],
        repo["html_url"],
        new Date(repo["created_at"]),
      ]);

    return repos;
  }

  function renderProfile(
    userAvatarUrl,
    userName,
    userBio,
    userJoinDate,
    userPortfolio,
    latestRepos,
  ) {
    userAvatarEl.setAttribute("src", `${userAvatarUrl}`);
    userNameEl.innerHTML = `${userName}`;
    userBioEl.innerHTML = `${userBio}`;
    userJoinDateEl.innerHTML = `${formatDate(userJoinDate)}`;
    userPortfolioEl.innerHTML = `Portfolio URL`;
    userPortfolioEl.setAttribute("href", `${userPortfolio}`);

    userLatestReposEl.innerHTML = "";
    for (const repo of latestRepos) {
      const [name, url, date] = repo;
      const repoP = document.createElement("p");
      repoP.innerHTML = `<a href="${url}" target="_blank"> ${name} </a> <span> ${formatDate(date)} </span>`;
      userLatestReposEl.appendChild(repoP);
    }
  }
});

function formatDate(date) {
  const dateObj = (date instanceof Date) ? date : new Date(date);
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return formattedDate;
}
