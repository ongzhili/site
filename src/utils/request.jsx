

// export async function fetchFromGitHub(repo, path) {
//     const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
//     console.log(GITHUB_TOKEN);

//     const octokit = new Octokit({
//         auth: GITHUB_TOKEN,
//     });

//     if (!GITHUB_TOKEN) {
//         throw new Error("Missing GitHub token in environment variables.");
//     }
//     try {
//         const response = await octokit.request(
//             'GET /repos/{owner}/{repo}/contents/{path}',
//             {
//                 owner: 'ongzhili',
//                 repo: repo,
//                 path: path,
//                 headers: {
//                     "X-GitHub-Api-Version": "2022-11-28",
//                 },
//             }
//         );

//         if (!response.ok) {
//             throw new Error(
//                 `GitHub API error: ${response.status} ${response.statusText}`
//             );
//         }

//         const data = await response.json(); // or response.text() if it's raw content
//         return data;
//     } catch (error) {
//         console.error("Fetch error:", error.message);
//         throw error;
//     }
// }
