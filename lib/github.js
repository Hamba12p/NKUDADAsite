// Git-based content persistence.
//
// The admin portal never writes to the local filesystem (Vercel's filesystem
// is read-only/ephemeral at runtime). Instead every save calls the GitHub
// Contents API, which commits the change straight to the repo. That commit
// triggers a normal Vercel deploy, and the change goes live once the build
// finishes (usually under a minute).

const API_BASE = "https://api.github.com";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !owner || !repo) {
    throw new Error(
      "Missing GitHub configuration. Set GITHUB_TOKEN, GITHUB_OWNER and GITHUB_REPO as environment variables."
    );
  }
  return { token, owner, repo, branch };
}

async function githubRequest(url, options = {}) {
  const { token } = getConfig();
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {})
    }
  });
  return res;
}

// Returns { sha, content (decoded string) } or null if the file doesn't exist yet.
export async function getFile(repoPath) {
  const { owner, repo, branch } = getConfig();
  const url = `${API_BASE}/repos/${owner}/${repo}/contents/${encodeURIComponent(
    repoPath
  ).replace(/%2F/g, "/")}?ref=${branch}`;

  const res = await githubRequest(url);
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub read failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { sha: data.sha, content };
}

// Creates or updates a file with new text content. Pass the object (not a
// string) when writing JSON, it will be stringified with 2-space indent.
export async function putFile(repoPath, contentValue, message) {
  const { owner, repo, branch } = getConfig();
  const existing = await getFile(repoPath);

  const bodyText =
    typeof contentValue === "string"
      ? contentValue
      : JSON.stringify(contentValue, null, 2) + "\n";

  const url = `${API_BASE}/repos/${owner}/${repo}/contents/${encodeURIComponent(
    repoPath
  ).replace(/%2F/g, "/")}`;

  const res = await githubRequest(url, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(bodyText, "utf-8").toString("base64"),
      branch,
      ...(existing ? { sha: existing.sha } : {})
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub write failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function deleteFile(repoPath, message) {
  const { owner, repo, branch } = getConfig();
  const existing = await getFile(repoPath);
  if (!existing) return { skipped: true };

  const url = `${API_BASE}/repos/${owner}/${repo}/contents/${encodeURIComponent(
    repoPath
  ).replace(/%2F/g, "/")}`;

  const res = await githubRequest(url, {
    method: "DELETE",
    body: JSON.stringify({ message, sha: existing.sha, branch })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub delete failed (${res.status}): ${text}`);
  }
  return res.json();
}
