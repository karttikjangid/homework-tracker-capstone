# Troubleshooting

| Issue observed | Cause | Fix |
| --- | --- | --- |
| Migration test failed despite a green pipeline | Relative Alembic path and a pipe masking pytest's failure | Set the test's working directory; require Bash pipefail |
| Argo CD core reconciliation failed | No explicitly declared project | Apply the repository-scoped AppProject first |
| GitOps remained Progressing in CI | Internal Ingress had no external load-balancer address | Isolate reconciliation; test HTTP Ingress in the primary release |
| SSH timed out during the final cloud review | The allowed source IP had changed | Update only the restricted /32 SSH rule through Terraform |
| Service verification timed out after the selector fix | EndpointSlice readiness did not establish HTTP readiness | Add bounded HTTP retries; require a successful response |
| Image and Service failure exercises | Deliberately invalid image tag and Service selector | Inspect Pod events/EndpointSlices, correct each value and verify recovery |

The [troubleshooting script](../scripts/troubleshoot.sh) records the intentional failure exercises. Earlier review evidence is retained in [screenshots](../screenshots/archive/README.md); current terminal captures include the commands, actual output and exit-status records. See the [verification guide](verification.md) for the successful rerun.
