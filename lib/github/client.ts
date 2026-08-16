import "server-only";

const GITHUB_API = "https://api.github.com";

interface GithubEnv {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

function getEnv(): GithubEnv {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !owner || !repo) {
    throw new Error("GitHub environment variables are not configured");
  }

  return { token, owner, repo, branch };
}

function headers(env: GithubEnv) {
  return {
    Authorization: `Bearer ${env.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

export interface GithubFileContent {
  sha: string;
  content: string;
  encoding: string;
}

export async function getRawUrl(path: string): Promise<string> {
  const env = getEnv();
  return `https://raw.githubusercontent.com/${env.owner}/${env.repo}/${env.branch}/${path}`;
}

export function getRepoUrl(path?: string): string {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!path) return `https://github.com/${owner}/${repo}`;
  return `https://github.com/${owner}/${repo}/blob/${branch}/${path}`;
}

export async function repositoryExists(): Promise<boolean> {
  const env = getEnv();
  const res = await fetch(`${GITHUB_API}/repos/${env.owner}/${env.repo}`, {
    headers: headers(env),
    cache: "no-store"
  });
  return res.ok;
}

export async function createRepository(): Promise<void> {
  const env = getEnv();
  const res = await fetch(`${GITHUB_API}/user/repos`, {
    method: "POST",
    headers: { ...headers(env), "Content-Type": "application/json" },
    body: JSON.stringify({
      name: env.repo,
      private: true,
      auto_init: true,
      description: "XYPHORIA database and tools storage"
    })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to create repository: ${body}`);
  }
}

export async function getFile(path: string): Promise<GithubFileContent | null> {
  const env = getEnv();
  const res = await fetch(
    `${GITHUB_API}/repos/${env.owner}/${env.repo}/contents/${encodeURI(path)}?ref=${env.branch}`,
    { headers: headers(env), cache: "no-store" }
  );

  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub getFile failed for ${path}: ${body}`);
  }

  const data = await res.json();
  if (Array.isArray(data)) {
    throw new Error(`Path ${path} is a directory, not a file`);
  }

  return { sha: data.sha, content: data.content, encoding: data.encoding };
}

export async function putFile(params: {
  path: string;
  content: string;
  message: string;
  sha?: string;
}): Promise<{ sha: string; rawUrl: string; githubUrl: string }> {
  const env = getEnv();
  const res = await fetch(
    `${GITHUB_API}/repos/${env.owner}/${env.repo}/contents/${encodeURI(params.path)}`,
    {
      method: "PUT",
      headers: { ...headers(env), "Content-Type": "application/json" },
      body: JSON.stringify({
        message: params.message,
        content: params.content,
        sha: params.sha,
        branch: env.branch
      })
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub putFile failed for ${params.path}: ${body}`);
  }

  const data = await res.json();
  return {
    sha: data.content.sha,
    rawUrl: await getRawUrl(params.path),
    githubUrl: getRepoUrl(params.path)
  };
}

export async function deleteFile(params: { path: string; message: string; sha: string }): Promise<void> {
  const env = getEnv();
  const res = await fetch(
    `${GITHUB_API}/repos/${env.owner}/${env.repo}/contents/${encodeURI(params.path)}`,
    {
      method: "DELETE",
      headers: { ...headers(env), "Content-Type": "application/json" },
      body: JSON.stringify({ message: params.message, sha: params.sha, branch: env.branch })
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub deleteFile failed for ${params.path}: ${body}`);
  }
}

export function decodeBase64(content: string): string {
  return Buffer.from(content, "base64").toString("utf-8");
}

export function encodeBase64(content: string): string {
  return Buffer.from(content, "utf-8").toString("base64");
}
