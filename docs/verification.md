# Verification — 16 October 2026

Terminal images use a macOS-style presentation frame. [Original captures and command records](../screenshots/terminal/) are retained.

[Successful standalone pipeline](https://github.com/karttikjangid/homework-tracker-capstone/actions/runs/38812142701), application image SHA `2b74cb7f4da3cbb2dccc8faaab52b23c68f46f98`. The chart defaults promote this release. Later commits contain documentation and evidence.

![Successful pipeline](../screenshots/terminal/github-actions.png)

Eleven API/migration tests passed. SAST, dependency, secret and both image scans passed. [Test output](../screenshots/verification/standalone-review-tests.txt) · [Backend scan](../screenshots/verification/standalone-backend-scan.txt) · [Frontend scan](../screenshots/verification/standalone-frontend-scan.txt)

![Tests in the live terminal](../screenshots/presentation/pytest.png)

The isolated Compose project started from an empty volume, rebuilt both application images and reached healthy status for all three services.

![docker compose ps](../screenshots/presentation/compose-ps.png)

![Successful API create response](../screenshots/presentation/api-create.png)

[Read/update response](../screenshots/terminal/api-read-update.txt) · [Statistics/delete response](../screenshots/terminal/api-stats-delete.txt) · [Exact commands and exit codes](../screenshots/terminal/compose-commands.json)

![PostgreSQL assignment and migration](../screenshots/presentation/database.png)

![Running Kubernetes Pods](../screenshots/presentation/kubernetes-pods.png)

![Helm release](../screenshots/presentation/helm.png)

![CPU autoscaling on Azure](../screenshots/presentation/cloud-hpa-load.png)

[HPA output](../screenshots/terminal/cloud-hpa-load.txt) shows two to four backend replicas under HTTP load. [CI GitOps state](../screenshots/verification/standalone-review-gitops.yaml) is Synced/Healthy after restoring a changed replica count. The rehearsal used the previous approved bootstrap image; the committed values now promote the standalone release.

![GitOps reconciliation](../screenshots/presentation/gitops.png)

![Prometheus target UP on Azure](../screenshots/terminal/cloud-prometheus-targets.png)

![Grafana request counter on Azure](../screenshots/terminal/cloud-grafana-dashboard.png)

![Terraform plan](../screenshots/presentation/terraform-plan.png)

![Terraform apply](../screenshots/presentation/terraform-apply.png)

[Azure upgrade and PostgreSQL persistence](../screenshots/terminal/cloud-api-after.txt) · [Recorded failure and recovery commands](../screenshots/terminal/cloud-troubleshooting.txt) · [First standalone Service timeout](../screenshots/terminal/service-check-first-attempt.txt)

![Terraform destroy](../screenshots/presentation/terraform-destroy.png)

![Azure resource group removed](../screenshots/presentation/azure-cleanup.png)

Terraform destroyed all nine resources. Azure returned `false` for the resource-group existence check; the SSH tunnel and monitoring forwards have stopped. The cloud URL is no longer hosted.

[Recorded walkthrough and chapters](walkthrough.md) · [Video](../screenshots/capstone-walkthrough.mp4) · [Image archive checksum](../screenshots/verification/release-images.json) · [Pipeline metadata](../screenshots/verification/standalone-ci-run.json)
