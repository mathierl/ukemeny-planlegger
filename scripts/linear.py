#!/usr/bin/env python3
"""
linear.py — minimal Linear ticket locking for the pr-loop pipeline.

Usage:
  python3 scripts/linear.py lock <TICKET-ID>   # claim a ticket before an agent starts work
  python3 scripts/linear.py done <TICKET-ID>   # mark a ticket done after you've merged the PR

Requires the LINEAR_API_KEY environment variable (a personal API key from
Linear: Settings > Account > Security & Access > Personal API keys).

No third-party dependencies — uses only the Python standard library.
"""
import json
import os
import sys
import urllib.request

API_URL = "https://api.linear.app/graphql"


def gql(query, variables=None):
    api_key = os.environ.get("LINEAR_API_KEY")
    if not api_key:
        sys.exit("Error: LINEAR_API_KEY is not set. Export it in your shell profile first.")
    body = json.dumps({"query": query, "variables": variables or {}}).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=body,
        headers={"Content-Type": "application/json", "Authorization": api_key},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        sys.exit(f"Linear API returned HTTP {e.code}:\n{error_body}")
    if "errors" in result:
        sys.exit(f"Linear API error: {result['errors']}")
    return result["data"]


def get_issue(ticket_id):
    query = """
    query($id: String!) {
      issue(id: $id) {
        id
        identifier
        title
        state { id name type }
        assignee { id name }
        team {
          id
          states { nodes { id name type } }
        }
      }
    }
    """
    data = gql(query, {"id": ticket_id})
    issue = data.get("issue")
    if not issue:
        sys.exit(f"No ticket found with identifier {ticket_id}")
    return issue


def get_viewer_id():
    data = gql("query { viewer { id name } }")
    return data["viewer"]["id"], data["viewer"]["name"]


def update_issue(issue_uuid, state_id=None, assignee_id=None):
    query = """
    mutation($id: String!, $input: IssueUpdateInput!) {
      issueUpdate(id: $id, input: $input) {
        success
        issue { identifier state { name } assignee { name } }
      }
    }
    """
    input_fields = {}
    if state_id:
        input_fields["stateId"] = state_id
    if assignee_id:
        input_fields["assigneeId"] = assignee_id
    data = gql(query, {"id": issue_uuid, "input": input_fields})
    return data["issueUpdate"]


def lock(ticket_id):
    issue = get_issue(ticket_id)
    current_type = issue["state"]["type"]

    if current_type in ("started", "completed"):
        print(f"BLOCKED: {ticket_id} is already '{issue['state']['name']}'"
              f"{' (assigned to ' + issue['assignee']['name'] + ')' if issue['assignee'] else ''}.")
        print("Refusing to dispatch an agent — this ticket may already be in progress.")
        sys.exit(1)

    started_states = [s for s in issue["team"]["states"]["nodes"] if s["type"] == "started"]
    if not started_states:
        sys.exit("Couldn't find a workflow state of type 'started' for this team. Check Linear's workflow config.")
    target_state = started_states[0]

    viewer_id, viewer_name = get_viewer_id()
    result = update_issue(issue["id"], state_id=target_state["id"], assignee_id=viewer_id)

    if result["success"]:
        print(f"Locked {ticket_id}: state -> {result['issue']['state']['name']}, "
              f"assignee -> {result['issue']['assignee']['name']}")
    else:
        sys.exit(f"Failed to lock {ticket_id}")


def done(ticket_id):
    issue = get_issue(ticket_id)
    completed_states = [s for s in issue["team"]["states"]["nodes"] if s["type"] == "completed"]
    if not completed_states:
        sys.exit("Couldn't find a workflow state of type 'completed' for this team.")
    target_state = completed_states[0]

    result = update_issue(issue["id"], state_id=target_state["id"])
    if result["success"]:
        print(f"Marked {ticket_id} as {result['issue']['state']['name']}")
    else:
        sys.exit(f"Failed to update {ticket_id}")


if __name__ == "__main__":
    if len(sys.argv) != 3 or sys.argv[1] not in ("lock", "done"):
        sys.exit("Usage: python3 scripts/linear.py [lock|done] <TICKET-ID>")
    action, ticket = sys.argv[1], sys.argv[2]
    if action == "lock":
        lock(ticket)
    else:
        done(ticket)