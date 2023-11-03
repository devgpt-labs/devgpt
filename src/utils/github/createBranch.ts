import { Octokit } from "@octokit/rest";

interface Blob {
	filePath: string;
	content: string;
	comments: string;
	examples: string[];
}

interface Auth {
	owner: string;
	editor: string;
	repo: string;
}

interface Branch {
	base_branch: string;
	branch_name: string;
	pr_title: string;
	pr_body: string;
	randomly_generated_5_digit_number: number;
}

interface createBranchProps {
	blobs: Blob[];
	auth: Auth;
	branch: Branch;
	access_token: string;
	pr: boolean;
}

const createBranch = async ({
	blobs,
	auth,
	branch,
	access_token,
	pr,
}: createBranchProps) => {
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
	// const blobs = [
	// 	{
	// 		filePath: "app2.js",
	// 		content: "const a = b",
	// 		comments: "i did this",
	// 		examples: ["app.js"],
	// 	},
	// ];

	//auth
	// const owner = "tom-lewis-code";
	// const editor = "tom";
	// const repo = "toms-public-sand-pit";

	//branch
	// const branch_name = "test-branch";
	// const pr_title = "my title";
	// const pr_body: any = "my body";
	// const randomly_generated_5_digit_number = Math.floor(
	// 	10000 + Math.random() * 90000
	// );

	const octokit = new Octokit({
		auth: access_token,
	});

	// get base
	const base = await octokit.git.getRef({
		owner: auth.owner,
		repo: auth.repo,
		ref: "heads/main",
	});

	const blobTree: any = await Promise.all(
		blobs.map(async (blob) => {
			const octoBlob = await octokit
				.request("POST /repos/{owner}/{repo}/git/blobs", {
					owner: auth.owner,
					repo: auth.repo,
					content: blob.content,
					encoding: "utf-8",
					headers: {
						"X-GitHub-Api-Version": "2022-11-28",
					},
				})
				.then((octoBlob: { data: { sha: any } }) => {
					return {
						path: blob.filePath,
						mode: "100644",
						type: "blob",
						sha: octoBlob.data.sha,
					};
				});

			return octoBlob;
		})
	);

	if (!blobTree) return {}

	// create tree
	const tree = await octokit.request("POST /repos/{owner}/{repo}/git/trees", {
		owner: auth.owner,
		repo: auth.repo,
		base_tree: base.data.object.sha,
		tree: blobTree,
		headers: {
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});

	if (!tree) return {}

	// //create commit
	const commit = await octokit.request(
		"POST /repos/{owner}/{repo}/git/commits",
		{
			owner: auth.owner,
			repo: auth.repo,
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

	if (!commit) return {}

	// generate ref
	const ref = await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
		owner: auth.owner,
		repo: auth.repo,
		ref: `refs/heads/${auth.editor}/${branch.randomly_generated_5_digit_number}/${branch.branch_name}`,
		sha: commit.data.sha,
		headers: {
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});

	if (!ref) return {}

	if (!pr) return {
		branch_name: `${auth.editor}/${branch.randomly_generated_5_digit_number}/${branch.branch_name}`,
	}

	const pullRequest = await octokit.request(
		"POST /repos/{owner}/{repo}/pulls",
		{
			owner: auth.owner,
			repo: auth.repo,
			title: branch.pr_title,
			body: branch.pr_body,
			head: `${auth.editor}/${branch.randomly_generated_5_digit_number}/${branch.branch_name}`,
			base: "main",
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
		}
	);

	if(!pullRequest) return {}

	return {
		branch_name: `${auth.editor}/${branch.randomly_generated_5_digit_number}/${branch.branch_name}`,
		pull_request: pullRequest.data.html_url,
	}
};

export default createBranch;
