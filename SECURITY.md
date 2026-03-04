# Security Policy

## Supported Versions

The project is actively maintained on the `main` branch.

| Version/Branch | Supported |
| --- | --- |
| `main` (latest) | Yes |
| Older commits/releases | No |

If you are running an older deployment, upgrade to the latest `main` before reporting behavior that may already be fixed.

## Reporting a Vulnerability

Please use **GitHub Private Vulnerability Reporting** for security issues.

- Repository: `arnoldcho/xpchain-web`
- Preferred channel: Security tab -> "Report a vulnerability"

If private reporting is unavailable, contact maintainers through a private channel and include:

1. Affected endpoint/path/component
2. Reproduction steps
3. Expected vs actual behavior
4. Impact assessment (confidentiality/integrity/availability)
5. Proof of concept (minimal)
6. Suggested fix (optional)

Do **not** open public issues for unpatched vulnerabilities.

## Response Timeline

Target response times:

1. Initial acknowledgement: within 72 hours
2. Triage decision: within 7 days
3. Fix timeline: based on severity and exploitability

## Disclosure Policy

Coordinated disclosure is required.

1. Maintainers validate and patch first
2. Security advisory/release note is published after mitigation
3. Credit is provided to the reporter unless anonymity is requested

## Scope

In scope:

- Application routes under `app/`
- API routes under `app/api/`
- Authentication/authorization or data-exposure issues
- Dependency vulnerabilities with practical exploit path

Out of scope (unless chained with real impact):

- Best-practice suggestions without exploitability
- Social engineering or phishing scenarios
- Denial-of-service requiring unrealistic resources

## Safe Harbor

Good-faith research is welcomed.

Please avoid:

- Accessing/modifying user or production data
- Service disruption
- Public disclosure before coordinated resolution

