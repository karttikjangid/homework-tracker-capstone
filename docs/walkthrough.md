# Recorded walkthrough

[Watch or download the recording](../screenshots/capstone-walkthrough.mp4). It combines actual screen recordings from the final review. Some waits are sped up, as marked below. There is no narration.

The publication recording starts with the initial repository push. The first standalone recovery check failed; its output is retained in the evidence. The successful pipeline and final Azure upgrade follow the fix.

| Time | Demonstration | Original recording |
| --- | --- | --- |
| 00:00 | Azure infrastructure provision (3x) | [Recording](../screenshots/terminal/azure-provision.webm) |
| 00:52 | Kubernetes and initial Helm release (2x) | [Recording](../screenshots/terminal/cloud-baseline.webm) |
| 01:37 | Create an assignment and check persistence | [Recording](../screenshots/terminal/cloud-before.webm) |
| 01:43 | Commit and publish the application change | [Recording](../screenshots/terminal/git-publish.webm) |
| 01:57 | Tests, clean Compose run and API checks (1.5x) | [Recording](../screenshots/terminal/compose.webm) |
| 02:34 | CPU load and scaling on Azure | [Recording](../screenshots/terminal/cloud-hpa.webm) |
| 03:21 | Broken image and Service recovery on Azure | [Recording](../screenshots/terminal/cloud-troubleshooting.webm) |
| 03:37 | Prometheus and Grafana on Azure | [Recording](../screenshots/terminal/cloud-monitoring-browser.webm) |
| 03:48 | Kubernetes, Helm, logs and GitOps status | [Recording](../screenshots/terminal/cluster.webm) |
| 04:09 | Successful standalone pipeline | [Recording](../screenshots/terminal/github-actions.webm) |
| 04:18 | Deploy the approved images and verify PostgreSQL | [Recording](../screenshots/terminal/cloud-upgrade.webm) |
| 05:29 | Updated frontend with the existing assignment | [Recording](../screenshots/terminal/cloud-after.webm) |
| 05:34 | Destroy the temporary Azure resources (3x) | [Recording](../screenshots/terminal/azure-cleanup.webm) |
