# Homework Tracker

[![CI/CD](https://github.com/karttikjangid/homework-tracker-capstone/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/karttikjangid/homework-tracker-capstone/actions/workflows/ci-cd.yml)

A course-assignment tracker built with React, FastAPI and PostgreSQL. Create assignments with a session, deadline, assignee and priority, then track their progress. This standalone repository retains the capstone's development history; the original coursework copy is preserved.

![Application on Azure](screenshots/terminal/cloud-after.png)

## Architecture

```text
GitHub → Actions → Tests + security gates → GHCR
              └→ Kind: Helm, browser tests, HPA, Argo CD

Terraform → VNet + NSG + Azure VM → K3s
GHCR release → Helm → React + FastAPI + PostgreSQL
                            ↓
                      Prometheus → Grafana

Browser → Ingress → React
              └── /api → FastAPI → PostgreSQL PVC
```

The cloud deployment uses one small Azure VM with K3s to limit cost. This differs from the reference rubric's AWS/EKS architecture. See the [requirements cross-check](REQUIREMENTS.md), [submission details](SUBMISSION.md) and [Terraform instructions](terraform/README.md).

## Run locally

Requirements: Docker with Compose v2. From the repository root:

```bash
docker compose up -d --build --wait
docker compose ps
curl -fsS http://localhost:8000/ready
```

Open [the frontend](http://localhost:3000) or [API documentation](http://localhost:8000/docs). PostgreSQL data stays in a named volume. Demo credentials are for this classroom application only.

```bash
docker compose down
# To remove the local demo database too:
docker compose down -v
```

For manual development, start only PostgreSQL, then run the backend and frontend in separate terminals:

```bash
docker compose down
docker compose up -d postgres
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
export DATABASE_URL=postgresql+psycopg://taskboard:taskboard@localhost:5432/taskboard
alembic upgrade head
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

```bash
cd frontend
npm ci
npm run dev -- --host 127.0.0.1
```

Open [localhost:5173](http://localhost:5173). Stop both development servers before starting the complete Compose stack.

## Tests and delivery

```bash
python -m pip install -r backend/requirements-dev.txt
python -m pytest -v backend/tests
cd frontend
npm ci
npm run build
cd ..
```

The [GitHub Actions workflow](.github/workflows/ci-cd.yml) runs API/migration tests, frontend builds, Bandit, pip-audit, npm audit, Trivy secret and image scans. Failed checks stop publication. Successful images are tagged with the source commit and deployed with Helm into a disposable Kubernetes cluster. Browser tests, HTTP Ingress, HPA load, monitoring and GitOps reconciliation are checked there too.

[Pipeline runs](https://github.com/karttikjangid/homework-tracker-capstone/actions) · [Release downloads](https://github.com/karttikjangid/homework-tracker-capstone/releases)

Images are published to `ghcr.io/karttikjangid/homework-tracker-backend` and `ghcr.io/karttikjangid/homework-tracker-frontend`. Both packages allow anonymous pulls. The release also includes an archive of the scanned images for offline replay.

## API checks

The clean Compose demo executes these commands in order. The terminal screenshots and command records below retain the responses.

```bash
curl -fsS -i http://localhost:8000/health && curl -fsS -i http://localhost:8000/ready
curl -fsS -i -X POST http://localhost:8000/api/tasks -H 'Content-Type: application/json' -d '{"title":"Capstone terminal demonstration","session_number":21,"due_date":"2026-10-16","assignee":"Kartik","priority":"HIGH"}'
TASK_ID=$(curl -fsS http://localhost:8000/api/tasks | python -c 'import json,sys; print(json.load(sys.stdin)[0]["id"])'); curl -fsS -i http://localhost:8000/api/tasks/$TASK_ID && curl -fsS -i -X PUT http://localhost:8000/api/tasks/$TASK_ID -H 'Content-Type: application/json' -d '{"status":"DONE"}'
curl -fsS -i http://localhost:8000/api/tasks/stats && curl -fsS -i -X DELETE http://localhost:8000/api/tasks/$TASK_ID
```

## Cloud and Kubernetes

[Terraform](terraform/) creates the network, restricted SSH rule, public IP and a `Standard_B2als_v2` VM. Private variables, state and SSH keys stay outside Git. Use an SSH tunnel for the Kubernetes API.

```bash
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
# Fill in your subscription, public SSH key and SSH source IP.
terraform -chdir=terraform init
terraform -chdir=terraform validate
terraform -chdir=terraform plan
terraform -chdir=terraform apply
# After the demonstration:
terraform -chdir=terraform destroy
```

Follow the [cluster connection steps](terraform/README.md#connect-to-k3s-for-a-presentation) to set `VM_IP`, `SSH_KEY` and `KUBECONFIG`. Keep the SSH tunnel open.

For optional offline replay, download the release archive and import it on the K3s node. It contains Linux/AMD64 images for the Azure VM:

```bash
curl -fLO https://github.com/karttikjangid/homework-tracker-capstone/releases/download/v1.0.0/homework-tracker-images.tar.gz
scp -i "$SSH_KEY" homework-tracker-images.tar.gz student@"$VM_IP":/tmp/
ssh -i "$SSH_KEY" student@"$VM_IP" \
  'sudo k3s ctr -n k8s.io images import /tmp/homework-tracker-images.tar.gz'
```

The [Helm chart](helm/taskboard/) includes two frontend replicas and two to four backend replicas, database storage, ConfigMap, Secret, probes, Ingress and CPU autoscaling. Alembic applies schema changes under a PostgreSQL advisory lock.

```bash
helm upgrade --install homework ./helm/taskboard -n session21 --create-namespace \
  --set ingress.className=traefik --set ingress.host='' --wait
kubectl -n session21 get pods,svc,ingress,hpa,pvc
```

## Monitoring and GitOps

Prometheus scrapes FastAPI's `/metrics`; Grafana displays the request counter. The [monitoring values](monitoring/) provision the datasource and dashboard. Application logs come from `kubectl logs`. [HPA exercise](scripts/test-hpa.sh) applies HTTP load and requires a real replica increase.

The [Argo CD Application](gitops/application.yaml) reads this repository's Helm chart and committed image tags. Automatic sync, pruning and self-healing restore declared state. CI changes a replica count and checks that Argo restores it. Its separate namespace disables Ingress/HPA to isolate reconciliation from the primary release's networking and scaling tests.

## Troubleshooting

| Issue observed | Cause | Fix |
| --- | --- | --- |
| Migration test failed despite a green pipeline | Relative Alembic path and a pipe masking pytest's failure | Set the test's working directory; require Bash pipefail |
| Argo CD core reconciliation failed | No explicitly declared project | Apply the repository-scoped AppProject first |
| GitOps remained Progressing in CI | Internal Ingress had no external load-balancer address | Isolate reconciliation; test HTTP Ingress in the primary release |
| SSH timed out during the final cloud review | The allowed source IP had changed | Update only the restricted /32 SSH rule through Terraform |
| Service verification timed out after the selector fix | EndpointSlice readiness did not establish HTTP readiness | Add bounded HTTP retries; require a successful response |
| Image and Service failure exercises | Deliberately invalid image tag and Service selector | Inspect Pod events/EndpointSlices, correct each value and verify recovery |

The [troubleshooting script](scripts/troubleshoot.sh) records the intentional failure exercises. Earlier review evidence is retained in [screenshots](screenshots/README.md); current terminal captures include the commands, actual output and exit-status records. The final standalone verification is listed below.

## Reference and lessons

Based on the instructor's [TaskBoard starter and rubric](https://github.com/Nency-Ravaliya/devops-heros/tree/main/session21-python). Assignment-specific fields, migrations, validation, browser error handling and delivery checks extend that reference. The project was developed with coding-assistant support.

The main lessons were to check raw test results as well as CI status, wait for database readiness, verify persistence through a browser, and destroy cloud resources after collecting evidence.

## Final verification — 16 October 2026

[Successful standalone pipeline](https://github.com/karttikjangid/homework-tracker-capstone/actions/runs/38812142701), application image SHA `2b74cb7f4da3cbb2dccc8faaab52b23c68f46f98`. The chart defaults promote this release. Later commits contain documentation and evidence.

![Successful pipeline](screenshots/terminal/github-actions.png)

Eleven API/migration tests passed. SAST, dependency, secret and both image scans passed. [Test output](screenshots/standalone-review-tests.txt) · [Backend scan](screenshots/standalone-backend-scan.txt) · [Frontend scan](screenshots/standalone-frontend-scan.txt)

![Tests in the live terminal](screenshots/terminal/pytest.png)

The isolated Compose project started from an empty volume, rebuilt both application images and reached healthy status for all three services.

![docker compose ps](screenshots/terminal/compose-ps.png)

![Successful API create response](screenshots/terminal/api-create.png)

[Read/update response](screenshots/terminal/api-read-update.txt) · [Statistics/delete response](screenshots/terminal/api-stats-delete.txt) · [Exact commands and exit codes](screenshots/terminal/compose-commands.json)

![PostgreSQL assignment and migration](screenshots/terminal/database.png)

![Running Kubernetes Pods](screenshots/terminal/kubernetes-pods.png)

![Helm release](screenshots/terminal/helm.png)

![CPU autoscaling on Azure](screenshots/terminal/cloud-hpa-load.png)

[HPA output](screenshots/terminal/cloud-hpa-load.txt) shows two to four backend replicas under HTTP load. [CI GitOps state](screenshots/standalone-review-gitops.yaml) is Synced/Healthy after restoring a changed replica count. The rehearsal used the previous approved bootstrap image; the committed values now promote the standalone release.

![GitOps reconciliation](screenshots/terminal/gitops.png)

![Prometheus target UP on Azure](screenshots/terminal/cloud-prometheus-targets.png)

![Grafana request counter on Azure](screenshots/terminal/cloud-grafana-dashboard.png)

![Terraform plan](screenshots/terminal/terraform-plan.png)

![Terraform apply](screenshots/terminal/terraform-apply.png)

[Azure upgrade and PostgreSQL persistence](screenshots/terminal/cloud-api-after.txt) · [Recorded failure and recovery commands](screenshots/terminal/cloud-troubleshooting.txt) · [First standalone Service timeout](screenshots/terminal/service-check-first-attempt.txt)

![Terraform destroy](screenshots/terminal/terraform-destroy.png)

![Azure resource group removed](screenshots/terminal/azure-cleanup.png)

Terraform destroyed all nine resources. Azure returned `false` for the resource-group existence check; the SSH tunnel and monitoring forwards have stopped. The cloud URL is no longer hosted.

[Recorded walkthrough and chapters](WALKTHROUGH.md) · [Video](screenshots/capstone-walkthrough.mp4) · [Image archive checksum](screenshots/release-images.json) · [Pipeline metadata](screenshots/standalone-ci-run.json)
