# Verification — 16 October 2026

Terminal views were refreshed in live Mac zsh on 17 October 2026. Recorded results retain their original dates; the local pytest suite was re-run. [Capture details](../screenshots/mac/README.md) and [original records](../screenshots/terminal/) are retained.

[Successful standalone pipeline](https://github.com/karttikjangid/homework-tracker-capstone/actions/runs/38812142701), application image SHA `2b74cb7f4da3cbb2dccc8faaab52b23c68f46f98`. These screenshots document the original release; the current patched image promotion is recorded below. Later commits contain documentation and evidence.

![Successful pipeline](../screenshots/terminal/github-actions.png)

## Repository and published images

The standalone repository's ten most recent commits, captured on 27 October 2026:

![Live Mac zsh: Ten capstone commits](../screenshots/mac/git-history-current.png)

Both public packages publish the approved application SHA `2b74cb7f4da3cbb2dccc8faaab52b23c68f46f98`. These package pages were captured on 27 October 2026.

![Public backend package with SHA-based image tags](../screenshots/verification/registry-backend.png)

![Public frontend package with SHA-based image tags](../screenshots/verification/registry-frontend.png)

## Application and deployment checks

Eleven API/migration tests passed. SAST, dependency, secret and both image scans passed. [Test output](../screenshots/verification/standalone-review-tests.txt) · [Backend scan](../screenshots/verification/standalone-backend-scan.txt) · [Frontend scan](../screenshots/verification/standalone-frontend-scan.txt)

Trivy scanned the frontend and backend container images for HIGH/CRITICAL vulnerabilities in their operating-system and application packages, with a nonzero exit code configured to block publication on findings. Both retained reports show zero findings for that recorded run; this is a result for those images and the vulnerability database used then, rather than a guarantee against future findings. Secret detection ran separately against the repository filesystem.

![Recorded CI output in live Mac zsh: Backend Trivy image scan excerpt](../screenshots/mac/trivy-backend-ci.png)

![Recorded CI output in live Mac zsh: Frontend Trivy image scan](../screenshots/mac/trivy-frontend-ci.png)

![Live Mac zsh: Tests in the live terminal](../screenshots/mac/pytest.png)

The isolated Compose project started from an empty volume, rebuilt both application images and reached healthy status for all three services.

![Recorded output in Mac zsh: Successful Compose build](../screenshots/mac/compose-build.png)

![Recorded output in Mac zsh: docker compose ps](../screenshots/mac/compose-ps.png)

![Recorded output in Mac zsh: Successful API create response](../screenshots/mac/api-create.png)

[Read/update response](../screenshots/terminal/api-read-update.txt) · [Statistics/delete response](../screenshots/terminal/api-stats-delete.txt) · [Exact commands and exit codes](../screenshots/terminal/compose-commands.json)

![Recorded output in Mac zsh: PostgreSQL assignment and migration](../screenshots/mac/database.png)

![Recorded output in Mac zsh: Running Kubernetes Pods](../screenshots/mac/kubernetes-pods.png)

![Recorded output in Mac zsh: Kubernetes Services](../screenshots/mac/kubernetes-services.png)

![Recorded output in Mac zsh: Helm release](../screenshots/mac/helm.png)

![Recorded output in Mac zsh: CPU autoscaling on Azure](../screenshots/mac/cloud-hpa-load.png)

[HPA output](../screenshots/terminal/cloud-hpa-load.txt) shows two to four backend replicas under HTTP load. [CI GitOps state](../screenshots/verification/standalone-review-gitops.yaml) is Synced/Healthy after restoring a changed replica count. The rehearsal used the previous approved bootstrap image; the committed values now promote the standalone release.

![Recorded output in Mac zsh: GitOps reconciliation](../screenshots/mac/gitops.png)

![Recorded output in Mac zsh: Backend Prometheus metrics](../screenshots/mac/metrics.png)

![Prometheus target UP on Azure](../screenshots/terminal/cloud-prometheus-targets.png)

![Grafana request counter on Azure](../screenshots/terminal/cloud-grafana-dashboard.png)

![Recorded output in Mac zsh: Terraform plan](../screenshots/mac/terraform-plan.png)

![Recorded output in Mac zsh: Terraform apply](../screenshots/mac/terraform-apply.png)

[Azure upgrade and PostgreSQL persistence](../screenshots/terminal/cloud-api-after.txt) · [Recorded failure and recovery commands](../screenshots/terminal/cloud-troubleshooting.txt) · [First standalone Service timeout](../screenshots/terminal/service-check-first-attempt.txt)

![Recorded output in Mac zsh: Terraform destroy](../screenshots/mac/terraform-destroy.png)

![Recorded output in Mac zsh: Azure resource group removed](../screenshots/mac/azure-cleanup.png)

Terraform destroyed all nine resources. Azure returned `false` for the resource-group existence check; the SSH tunnel and monitoring forwards have stopped. The cloud URL is no longer hosted.

[Recorded walkthrough and chapters](walkthrough.md) · [Video](../screenshots/capstone-walkthrough.mp4) · [Image archive checksum](../screenshots/verification/release-images.json) · [Pipeline metadata](../screenshots/verification/standalone-ci-run.json)

## 27 October runtime security update

The [patched image pipeline](https://github.com/karttikjangid/homework-tracker-capstone/actions/runs/40482257507) passed the complete test, security, Compose, Kubernetes, HPA, recovery, monitoring and GitOps checks. It publishes SHA `3ed8bf722561b28c71d1e3861dcbc741bd3ff4b1`. The chart and GitOps defaults now promote these patched images. The earlier screenshots and cloud recording remain dated historical evidence.
