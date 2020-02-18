import { LightningElement, track } from "lwc";
const QUERY_URL = "https://api.github.com/users/";
const users = [
  "lukethacoder",
  "KyleAMathews",
  "DevonCrawford",
  "wesbos",
  "stolinski"
];

export default class GithubAPI extends LightningElement {
  @track inputUsername = "lukethacoder";
  @track userData;
  @track userRepos;
  @track error;

  // use connectedCallback() to fire anything that needs to be run on init
  connectedCallback() {
    // set user to a random item within the 'users' array
    this.inputUsername = users[Math.floor(Math.random() * users.length)];
  }

  handleUsernameChange(event) {
    // update the inputUsername value on input change
    this.inputUsername = event.target.value;
  }

  // GET user meta data
  handleGetGithubData() {
    this.userData = undefined;
    this.userRepos = undefined;
    // send a GET request to the github api with the search appended
    fetch(QUERY_URL + this.inputUsername)
      .then(res => {
        // fetch isn't throwing an error if the request fails.
        // Therefore we have to check the ok property.
        if (!res.ok) {
          this.error = res;
        }
        return res.json();
      })
      .then(json => {
        console.log("sf json", json);
        if (json.message === "Not Found") {
          this.userData = undefined;
          this.error = "No User Found";
        } else if (
          json.documentation_url ===
          "https://developer.github.com/v3/#rate-limiting"
        ) {
          this.error =
            "Oops, max API limit reached. Authenticated users get more requests";
        } else {
          this.userData = json;
          this.handleGetGithubRepos();
        }
      })
      .catch(error => {
        this.error = error;
        this.userData = undefined;
      });
  }

  // GET user repos
  handleGetGithubRepos() {
    fetch(QUERY_URL + this.inputUsername + "/repos")
      .then(res => {
        if (!res.ok) {
          this.error = res;
        }
        return res.json();
      })
      .then(json => {
        console.log("sf json", json);
        if (json.message === "Not Found") {
          this.userRepos = undefined;
          this.error = "No Repos Found";
        } else if (
          json.documentation_url ===
          "https://developer.github.com/v3/#rate-limiting"
        ) {
          this.error =
            "Oops, max API limit reached. Authenticated users get more requests";
        } else {
          this.userRepos = json;
        }
      })
      .catch(error => {
        this.error = error;
        this.userRepos = undefined;
      });
  }
}
