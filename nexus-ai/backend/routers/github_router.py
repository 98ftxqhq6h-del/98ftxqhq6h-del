from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional, List
from services.github_service import GitHubService

router = APIRouter(prefix="/api/github", tags=["GitHub Assistant"])

class CreateIssueReq(BaseModel):
    repo: str
    title: str
    body: str
    labels: Optional[List[str]] = None

class CreatePRReq(BaseModel):
    repo: str
    title: str
    head: str
    base: Optional[str] = "main"
    body: Optional[str] = ""

class CodeReviewReq(BaseModel):
    code: str

class CommitSuggestReq(BaseModel):
    diff: str

class ReleaseNotesReq(BaseModel):
    version: Optional[str] = "v2.5.0"
    changes: Optional[List[str]] = None

@router.get("/repos")
def search_repos(q: str = Query("98ftxqhq6h-del", description="Query term")):
    return GitHubService.search_repositories(query=q)

@router.get("/issues")
def get_issues(repo: str = Query("98ftxqhq6h-del/98ftxqhq6h-del.github.io"), state: str = Query("open")):
    return GitHubService.get_issues(repo=repo, state=state)

@router.post("/issues")
def create_issue(data: CreateIssueReq):
    return GitHubService.create_issue(data.repo, data.title, data.body, data.labels)

@router.post("/pulls")
def create_pr(data: CreatePRReq):
    return GitHubService.create_pull_request(data.repo, data.title, data.head, data.base or "main", data.body or "")

@router.post("/review")
def review_code(data: CodeReviewReq):
    return GitHubService.review_code(data.code)

@router.post("/commit-suggestion")
def commit_suggestion(data: CommitSuggestReq):
    return GitHubService.suggest_commit_message(data.diff)

@router.post("/release-notes")
def release_notes(data: ReleaseNotesReq):
    return GitHubService.generate_release_notes(data.version or "v2.5.0", data.changes)

@router.get("/cicd")
def cicd_status(repo: str = Query("98ftxqhq6h-del/98ftxqhq6h-del.github.io")):
    return GitHubService.get_cicd_status(repo=repo)
