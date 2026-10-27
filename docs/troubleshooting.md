# Troubleshooting

| Issue observed | Cause | Fix |
| --- | --- | --- |
| GitOps reconciliation timed out on 27 October | Argo CD could not reach Redis; the workflow had not checked Redis readiness | Add a Redis readiness probe, wait for rollout and require authenticated PONG before reconciliation; collect Pod diagnostics on failure |
| Frontend image scan blocked the 27 October rebuild | The base image contained vulnerable Brotli/curl packages; the Dockerfile upgraded only TIFF | Upgrade all installed Alpine packages during the runtime build, then rebuild and retain the HIGH/CRITICAL gate |
| Migration test failed despite a green pipeline | Relative Alembic path and a pipe masking pytest's failure | Set the test's working directory; require Bash pipefail |
| Argo CD core reconciliation failed | No explicitly declared project | Apply the repository-scoped AppProject first |
| GitOps remained Progressing in CI | Internal Ingress had no external load-balancer address | Isolate reconciliation; test HTTP Ingress in the primary release |
| SSH timed out during the final cloud review | The allowed source IP had changed | Update only the restricted /32 SSH rule through Terraform |
| Service verification timed out after the selector fix | EndpointSlice readiness did not establish HTTP readiness | Add bounded HTTP retries; require a successful response |
| Image and Service failure exercises | Deliberately invalid image tag and Service selector | Inspect Pod events/EndpointSlices, correct each value and verify recovery |

The [troubleshooting script](../scripts/troubleshoot.sh) records the intentional failure exercises. Earlier review evidence is retained in [screenshots](../screenshots/archive/README.md); current terminal captures include the commands, actual output and exit-status records. See the [verification guide](verification.md) for the successful rerun.

The [27 October blocked run](https://github.com/karttikjangid/homework-tracker-capstone/actions/runs/40449565632) reported `CVE-2026-111497` in `brotli-libs` and `CVE-2026-92392` in `curl`/`libcurl`. The scan listed fixed packages `1.2.1-r0` and `8.23.0-r0` respectively. These are findings from that rebuild, separate from the earlier clean release evidence.

The [Redis timeout run](https://github.com/karttikjangid/homework-tracker-capstone/actions/runs/40449983349) passed both image scans and the primary application checks. Its logs establish Redis unavailability, but do not identify the underlying Redis startup or networking failure. The earlier image-security fix remains in place.
