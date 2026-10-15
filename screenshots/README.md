# Evidence index

## Standalone capstone — 16 October 2026

- [Successful pipeline](https://github.com/karttikjangid/homework-tracker-capstone/actions/runs/38812142701), image/source SHA `2b74cb7f4da3cbb2dccc8faaab52b23c68f46f98`
- [Eleven passing tests](standalone-review-tests.txt), [SAST](standalone-sast-report.json), [dependency audit](standalone-sca-report.json), [secret scan](standalone-secret-report.json), [backend](standalone-backend-scan.txt) and [frontend](standalone-frontend-scan.txt) image scans
- [Live terminal screenshots, recordings and command records](terminal/)
- [GitOps Synced/Healthy after self-healing](standalone-review-gitops.yaml) and [HPA scale-up](standalone-review-hpa.txt)
- [Cloud update with retained PostgreSQL assignment](terminal/cloud-api-after.txt)
- [Terraform destroy](terminal/terraform-destroy.txt) and [Azure cleanup](terminal/azure-cleanup.txt)
- [Recorded walkthrough and chapters](../WALKTHROUGH.md)

The terminal captures show commands executing in a Bash PTY through a browser terminal. The command records include timestamps and exit statuses. Browser screenshots show the running application, GitHub Actions, Prometheus and Grafana.

The first standalone run's [Service check timeout](terminal/service-check-first-attempt.txt) is retained separately from the successful rerun. The live cloud checks and the final CI exercise both passed after adding bounded HTTP verification.

## Earlier coursework evidence


Current standalone verification is listed in the project README. Files below retain the earlier coursework review and its original run URLs. They are historical evidence, not results from the new standalone pipeline.


## Review on 15 October 2026

- [Eleven passing CI tests](review-tests.txt) and [local tests from the CI working directory](review-ci-command-local.txt)
- [Pipeline metadata](review-ci-run.json) and [successful run screenshot](review-github-actions.png)
- [HPA scale-up from two to four](review-hpa.txt)
- [GitOps final Synced/Healthy state](review-gitops.yaml) and [ready Pods](review-gitops.txt)
- [Troubleshooting before/after output](review-troubleshooting.txt)
- [Prometheus target UP](review-prometheus-targets.png) and [Grafana request counter](review-grafana-dashboard.png)
- [Backend scan](review-ci-backend-scan.txt), [frontend scan](review-ci-frontend-scan.txt), [SAST](review-ci-sast-report.json), [SCA](review-ci-sca-report.json), [secret scan](review-ci-secret-report.json)
- [Failing pipelines propagate through tee](review-pipefail.txt)
- [Clean Compose run and non-root users](review-compose.txt)
- [Manual FastAPI/Vite startup against PostgreSQL](review-manual.txt)
- [API CRUD and validation](review-api.txt)
- [PostgreSQL persistence](review-persistence.txt) and [concurrent migrations with existing data](review-concurrent-migrations.txt)
- [Browser test result](review-browser.txt)
- [Bandit](review-sast.json) and [runtime dependency audit](review-sca.json)
- [Helm lint](review-helm.txt) and [Terraform validation](review-terraform.txt)
- [Local cleanup](review-cleanup.txt) and [Azure resource-group check](review-azure-check.txt)
- [Assignment creation, status update and reload](review-frontend.png)
- [Rejected save with form data retained](review-frontend-error.png)
- [Mobile layout](review-frontend-mobile.png)
- [Pipeline run](https://github.com/karttikjangid/devops-heros/actions/runs/38743325335): source SHA and job logs are available on the run page. Test, security, browser, monitoring, troubleshooting and GitOps artifacts are uploaded there.

The browser error check deliberately returns HTTP 503 for one POST request to verify error handling; it is not an unexplained production outage.

[GitOps first attempt](review-gitops-first-attempt.txt) timed out; [the next attempt](review-gitops-health-attempt.txt) synced but waited on Ingress health; it is retained separately from the final verification.

The first green run reached Healthy before the self-healing exercise and restored both replicas. Its immediate [post-scale snapshot](review-gitops-before-health-refresh.yaml) still showed a cached Progressing state. The final capture now waits for Healthy again after the rollout. [Earlier command log](review-gitops-previous-run.txt).

[Test output before the gate fix](review-ci-tests-before-pipefail.txt) contains a failed migration test despite its run’s green status. That status was invalid verification: `tee` masked pytest’s exit status. The test working directory and CI shell were corrected, and the final output is checked directly.

## Earlier run on 10 October 2026

The other files record the earlier local and Azure deployment. Dates and commands remain in the `.txt` files. Terminal images are formatted views of those linked transcripts, not captures of a terminal window. Browser images are direct browser captures. Refer to the text and workflow logs for exact commands and results.

- [Manual API/database checks](manual-test.txt)
- [Compose build/start](docker-compose-build.txt) and [service list](docker-compose-ps.txt)
- [API CRUD](api-test.txt) and [database checks](database-test.txt)
- [Terraform plan](terraform-plan.txt), [apply](terraform-apply.txt), [destroy](terraform-destroy.txt), [Azure cleanup](azure-cleanup.txt)
- [Cloud deployment](cloud-deploy.txt), [Kubernetes](cloud-kubernetes.txt), [cloud API](cloud-api.txt), [rollout](cloud-rollout.txt)
- [Cloud browser](cloud-frontend.png), [Prometheus](prometheus-targets.png), [Grafana](grafana-dashboard.png)
- [Earlier walkthrough](session21-demo.webm)

The cloud resources were destroyed after that run. The current final review uses a fresh Azure deployment and new recordings under `terminal/`; the earlier files retain their original dates.
