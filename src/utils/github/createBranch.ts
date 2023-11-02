import { Octokit } from "@octokit/rest";

const createBranch = async (
	access_token: any,
	pr: boolean,
	setBranchName: (branch_name: any) => void,
	setPullRequest: (pull_request_url: any) => void
) => {
	if (!access_token) {
		console.warn("no access token");
		return;
	}

  // fileName
  // originalContent
  // newContent
  // tasksCompletedPreviously
  // similarFiles

  //results
	const blobs = [
		{
			filePath: "app2.js",
			content: "const a = b",
			comments: "i did this",
			examples: ["app.js"],
		},
	];

  //auth
	const owner = "tom-lewis-code";
	const editor = "tom";
	const repo = "toms-public-sand-pit";

  //branch
	const branch_name = "test-branch";
	const pr_title = "my title";
	const pr_body: any = "my body";
	const randomly_generated_5_digit_number = Math.floor(
		10000 + Math.random() * 90000
	);

	const octokit = new Octokit({
		auth: access_token,
	});

	// get base
	const base = await octokit.git.getRef({
		owner: owner,
		repo: repo,
		ref: "heads/main",
	});

	const blobTree: any = await Promise.all(
		blobs.map(async (blob) => {
			const octoBlob = await octokit
				.request("POST /repos/{owner}/{repo}/git/blobs", {
					owner: owner,
					repo: repo,
					content: blob.content,
					encoding: "utf-8",
					headers: {
						"X-GitHub-Api-Version": "2022-11-28",
					},
				})
				.then((octoBlob: { data: { sha: any } }) => {
					return {
						path: blob.path,
						mode: "100644",
						type: "blob",
						sha: octoBlob.data.sha,
					};
				});

			return octoBlob;
		})
	);

	// create tree
	const tree = await octokit.request("POST /repos/{owner}/{repo}/git/trees", {
		owner: owner,
		repo: repo,
		base_tree: base.data.object.sha,
		tree: blobTree,
		headers: {
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});

	// //create commit
	const commit = await octokit.request(
		"POST /repos/{owner}/{repo}/git/commits",
		{
			owner: owner,
			repo: repo,
			message: "hello, world!",
			author: {
				name: "Tom",
				email: "tom@feb.co.uk",
				date: new Date().toISOString(),
			},
			parents: [base.data.object.sha],
			tree: tree.data.sha,
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
		}
	);

	// generate ref
	const ref = await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
		owner: owner,
		repo: repo,
		ref: `refs/heads/${editor}/${randomly_generated_5_digit_number}/${branch_name}`,
		sha: commit.data.sha,
		headers: {
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});

	setBranchName(
		`${editor}/${randomly_generated_5_digit_number}/${branch_name}`
	);

	// //create PR
	// if (!pr) return;

	const pullRequest = await octokit.request(
		"POST /repos/{owner}/{repo}/pulls",
		{
			owner: owner,
			repo: repo,
			title: pr_title,
			body: pr_body,
			head: `${editor}/${randomly_generated_5_digit_number}/${branch_name}`,
			base: "main",
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
		}
	);

	console.log({ pullRequest });
	setPullRequest(pullRequest.data.html_url);

	return;

	// const baseTree = await octokit.request(
	// 	"GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
	// 	{
	// 		owner: owner,
	// 		repo: repo,
	// 		tree_sha: "main",
	// 		headers: {
	// 			"X-GitHub-Api-Version": "2022-11-28",
	// 		},
	// 	}
	// );

	// //generate ref
	// await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
	// 	owner: owner,
	// 	repo: repo,
	// 	ref: `refs/heads/abc`,
	// 	sha: commit.data.sha,
	// 	headers: {
	// 		"X-GitHub-Api-Version": "2022-11-28",
	// 	},
	// });

	// //create PR
	// const pullRequest = await octokit.request(
	// 	"POST /repos/{owner}/{repo}/pulls",
	// 	{
	// 		owner: owner,
	// 		repo: repo,
	// 		title: "my title",
	// 		body: "my body",
	// 		head: `${owner}:abc`,
	// 		base: "main",
	// 		headers: {
	// 			"X-GitHub-Api-Version": "2022-11-28",
	// 		},
	// 	}
	// );

	// const final = await octokit.request("POST /repos/{owner}/{repo}/git/trees", {
	// 	owner: owner,
	// 	repo: repo,
	// 	base_tree: baseTree.data.sha,
	// 	tree: [
	// 		{
	// 			path: "App.js",
	// 			mode: "100644",
	// 			type: "blob",
	// 			sha: blobSha.data.sha,
	// 		},
	// 	],
	// 	headers: {
	// 		"X-GitHub-Api-Version": "2022-11-28",
	// 	},
	// });

	// const branch = await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
	// 	owner: owner,
	// 	repo: repo,
	// 	ref: "refs/heads/featureA",
	// 	sha: tree.data.sha,
	// 	headers: {
	// 		"X-GitHub-Api-Version": "2022-11-28",
	// 	},
	// });
};

export default createBranch;
