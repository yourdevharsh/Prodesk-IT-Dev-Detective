document.addEventListener("DOMContentLoaded", () => {
  const firstInput = document.getElementById("firstInput");
  const secondInput = document.getElementById("secondInput");

  const firstUserAvatarEl = document.querySelector("#firstUserCard img");
  const firstUserNameEl = document.querySelector("#firstUserCard .userName");
  const firstUserBioEl = document.querySelector("#firstUserCard .userBio");
  const firstUserJoinDateEl = document.querySelector(
    "#firstUserCard .userJoinDate",
  );
  const firstUserPortfolioEl = document.querySelector(
    "#firstUserCard .userPortfolio",
  );
  const firstUserLatestReposEl = document.querySelector(
    "#firstUserCard .userLatestRepos",
  );
  const firstUserStarsEl = document.querySelector("#firstUserCard .userStars");
  const firstUserFollowersEl = document.querySelector(
    "#firstUserCard .userFollowers",
  );

  const secondUserAvatarEl = document.querySelector("#secondUserCard img");
  const secondUserNameEl = document.querySelector("#secondUserCard .userName");
  const secondUserBioEl = document.querySelector("#secondUserCard .userBio");
  const secondUserJoinDateEl = document.querySelector(
    "#secondUserCard .userJoinDate",
  );
  const secondUserPortfolioEl = document.querySelector(
    "#secondUserCard .userPortfolio",
  );
  const secondUserLatestReposEl = document.querySelector(
    "#secondUserCard .userLatestRepos",
  );
  const secondUserStarsEl = document.querySelector(
    "#secondUserCard .userStars",
  );
  const secondUserFollowersEl = document.querySelector(
    "#secondUserCard .userFollowers",
  );

  const battleModeSearchBtn = document.querySelector("#battleMode button");

  battleModeSearchBtn.addEventListener("click", async () => {
    const firstUsername = firstInput.value.trim();
    const secondUsername = secondInput.value.trim();

    if (firstUsername.length < 1 || secondUsername.length < 1) {
      return;
    }

    try {
      document.getElementById("loadingBox").style.display = "flex";
      const [firstUserData, secondUserData] = await fetchProfiles([
        firstUsername,
        secondUsername,
      ]);

      const repoUrls = [
        firstUserData["repoUrlToSearch"],
        secondUserData["repoUrlToSearch"],
      ];

      const [firstUserRepoAndStars, secondUserRepoAndStars] =
        await getReposAndStars(repoUrls);

      renderProfiles(
        firstUserData,
        firstUserRepoAndStars,
        secondUserData,
        secondUserRepoAndStars,
      );
    } catch (error) {
      alert(error.message);
    } finally {
      document.getElementById("loadingBox").style.display = "none";
    }
  });

  async function fetchProfiles(usernames) {
    const requests = usernames.map((username) =>
      fetch(`https://api.github.com/users/${username}`),
    );

    const responses = await Promise.all(requests);

    const data = await Promise.all(
      responses.map((res) => {
        if (!res.ok) throw new Error("Username not found");
        return res.json();
      }),
    );

    return [
      {
        userAvatarUrl: data[0]["avatar_url"],
        userName: data[0]["name"] || data[0]["login"],
        userBio: data[0]["bio"],
        userJoinDate: new Date(data[0]["created_at"]),
        userPortfolio: data[0]["blog"],
        userFollowers: data[0]["followers"],
        repoUrlToSearch: data[0]["repos_url"],
      },
      {
        userAvatarUrl: data[1]["avatar_url"],
        userName: data[1]["name"] || data[1]["login"],
        userBio: data[1]["bio"],
        userJoinDate: new Date(data[1]["created_at"]),
        userPortfolio: data[1]["blog"],
        userFollowers: data[1]["followers"],
        repoUrlToSearch: data[1]["repos_url"],
      },
    ];
  }

  async function fetchRepos(repoUrls) {
    try {
      const requests = repoUrls.map((repoUrl) => fetch(repoUrl));

      const responses = await Promise.all(requests);

      const data = await Promise.all(
        responses.map((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        }),
      );
      return data;
    } catch (error) {
      return error;
    }
  }

  async function getReposAndStars(repoUrls) {
    const [firstUserData, secondUserData] = await fetchRepos(repoUrls);

    const firstUserSortedData = firstUserData.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );

    const secondUserSortedData = secondUserData.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );

    const firstUserStars = calculateStars(firstUserSortedData);
    const secondUserStars = calculateStars(secondUserSortedData);

    const firstUserRepos = getLatestRepos(firstUserSortedData);
    const secondUserRepos = getLatestRepos(secondUserSortedData);

    return [
      {
        firstUserStars: firstUserStars,
        firstUserRepos: firstUserRepos,
      },
      {
        secondUserStars: secondUserStars,
        secondUserRepos: secondUserRepos,
      },
    ];
  }

  function calculateStars(userData) {
    const stars = userData.reduce((total, data) => {
      return total + data["stargazers_count"];
    }, 0);
    return stars;
  }

  function getLatestRepos(userData) {
    return userData
      .slice(0, 5)
      .map((repo) => [
        repo["name"],
        repo["html_url"],
        new Date(repo["created_at"]),
      ]);
  }

  function renderProfiles(
    firstMainData,
    firstReposAndStars,
    secondMainData,
    secondReposAndStars,
  ) {
    const firstUserAvatarUrl = firstMainData.userAvatarUrl;
    const firstUserName = firstMainData.userName;
    const firstUserBio = firstMainData.userBio;
    const firstUserJoinDate = firstMainData.userJoinDate;
    const firstUserPortfolio = firstMainData.userPortfolio;
    const firstUserFollowers = firstMainData.userFollowers;
    const firstUserStars = firstReposAndStars.firstUserStars;
    const firstUserRepos = firstReposAndStars.firstUserRepos;

    const secondUserAvatarUrl = secondMainData.userAvatarUrl;
    const secondUserName = secondMainData.userName;
    const secondUserBio = secondMainData.userBio;
    const secondUserJoinDate = secondMainData.userJoinDate;
    const secondUserPortfolio = secondMainData.userPortfolio;
    const secondUserFollowers = secondMainData.userFollowers;
    const secondUserStars = secondReposAndStars.secondUserStars;
    const secondUserRepos = secondReposAndStars.secondUserRepos;

    firstUserAvatarEl.setAttribute("src", `${firstUserAvatarUrl}`);
    firstUserNameEl.innerHTML = `${firstUserName}`;
    firstUserBioEl.innerHTML = `${firstUserBio}`;
    firstUserJoinDateEl.innerHTML = `${formatDate(firstUserJoinDate)}`;
    firstUserPortfolioEl.innerHTML = `Portfolio URL`;
    firstUserPortfolioEl.setAttribute("href", `${firstUserPortfolio}`);
    firstUserStarsEl.innerHTML = `${firstUserStars}`;
    firstUserFollowersEl.innerHTML = `${firstUserFollowers}`;

    firstUserLatestReposEl.innerHTML = "";
    for (const repo of firstUserRepos) {
      const [name, url, date] = repo;
      const repoP = document.createElement("p");
      repoP.innerHTML = `<a href="${url}" target="_blank"> ${name} </a> <span> ${formatDate(date)} </span>`;
      firstUserLatestReposEl.appendChild(repoP);
    }

    secondUserAvatarEl.setAttribute("src", `${secondUserAvatarUrl}`);
    secondUserNameEl.innerHTML = `${secondUserName}`;
    secondUserBioEl.innerHTML = `${secondUserBio}`;
    secondUserJoinDateEl.innerHTML = `${formatDate(secondUserJoinDate)}`;
    secondUserPortfolioEl.innerHTML = `Portfolio URL`;
    secondUserPortfolioEl.setAttribute("href", `${secondUserPortfolio}`);
    secondUserStarsEl.innerHTML = `${secondUserStars}`;
    secondUserFollowersEl.innerHTML = `${secondUserFollowers}`;

    secondUserLatestReposEl.innerHTML = "";
    for (const repo of secondUserRepos) {
      const [name, url, date] = repo;
      const repoP = document.createElement("p");
      repoP.innerHTML = `<a href="${url}" target="_blank"> ${name} </a> <span> ${formatDate(date)} </span>`;
      secondUserLatestReposEl.appendChild(repoP);
    }

    const firstCard = document.getElementById("firstUserCard");
    const secondCard = document.getElementById("secondUserCard");

    if (Number(firstUserStars) > Number(secondUserStars)) {
      firstCard.style.border = "5px solid green";
      secondCard.style.border = "5px solid red";
    } else if (Number(secondUserStars) > Number(firstUserStars)) {
      firstCard.style.border = "5px solid red";
      secondCard.style.border = "5px solid green";
    } else {
      if (Number(firstUserFollowers) > Number(secondUserFollowers)) {
        firstCard.style.border = "5px solid green";
        secondCard.style.border = "5px solid red";
      } else if (Number(firstUserStars) > Number(firstUserFollowers)) {
        firstCard.style.border = "5px solid red";
        secondCard.style.border = "5px solid green";
      } else {
        firstCard.style.border = "5px solid gray";
        secondCard.style.border = "5px solid gray";
      }
    }
  }

  function formatDate(date) {
    const dateObj = date instanceof Date ? date : new Date(date);
    const formattedDate = dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return formattedDate;
  }
});
