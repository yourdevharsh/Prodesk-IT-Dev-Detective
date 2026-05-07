# Dev-Detective: GitHub User Search & Battle App

A dynamic, asynchronous web application built for the Prodesk IT Week 3 Internship Assignment. 

This project interacts with the official **GitHub REST API** to fetch real-time developer profiles and repositories. It fulfills the **Level 3 (Advanced)** requirements, featuring a "Normal Mode" for standard searching and a "Battle Mode" that fetches two users simultaneously to compare their stats.

👉 **[[Live Demo Link Here](https://prodesk-it-dev-detective.vercel.app/)]**

---

## 📸 Screenshot

![Dev-Detective Battle Mode View](/screenshots/image.png)

---

## ✨ Features Built (Meeting Assignment Requirements)

### Level 1: Fetch API & Error Handling
* **Live Search:** Users can enter a GitHub username to dynamically fetch and render their Avatar, Name, Bio, Join Date, and Portfolio URL.
* **Robust Error Handling:** Catches `404 Not Found` API errors and throws user-friendly alerts instead of letting the application crash.
* **Loading State:** Displays a custom UI loading indicator while waiting for the asynchronous API Promises to resolve.

### Level 2: Deep Data Extraction
* **Nested Fetching:** Uses the `repos_url` from the initial user payload to execute a second API call fetching the user's repositories.
* **Sorting & Formatting:** Sorts repositories chronologically, slices the Top 5 most recent, and reformats the ISO date string (e.g., `2023-01-25T12:00:00Z`) into a readable `DD MMM YYYY` format.
* **Quick Links:** Repositories are rendered as clickable links that safely open the actual GitHub repo in a new tab (`target="_blank"`).

### Level 3: Advanced Async/Await (Battle Mode)
* **Simultaneous Fetching:** Utilizes `Promise.all()` to fetch two distinct GitHub users simultaneously, heavily optimizing network load times.
* **Stat Aggregation:** Uses array `.reduce()` to loop through all fetched repositories and calculate the exact combined `stargazers_count` for each user.
* **Dynamic DOM Styling:** Compares the total stars of both users and dynamically highlights the Winner's card in Green and the Loser's card in Red. (Includes a Follower-count tie-breaker logic!).

---

## 🛠️ Tech Stack

* **HTML5 & CSS3** (CSS Grid for Profile Cards, Custom Tabs)
* **Vanilla JavaScript** (ES6+, DOM Manipulation)
* **Async/Await & Promises**
* **GitHub REST API**

---

## 🚀 Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/yourdevharsh/Prodesk-IT-Dev-Detective
   ```
2. Navigate to the project directory:
   ```
   cd prodesk-it-dev-detective
   ```
3. Run this command in terminal:
   ```
   npm run dev
   ```
4. Open in browser


(Note: The GitHub API has a rate limit of 60 requests per hour for unauthenticated IPs. If you hit an error, wait an hour.)


Designed and developed by [Your Name] for Prodesk IT Week 3 Mission.