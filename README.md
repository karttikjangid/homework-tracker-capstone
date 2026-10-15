# Homework Tracker — DevOps Capstone

A course-assignment tracker built with React, FastAPI and PostgreSQL. Create assignments with a session, deadline, assignee and priority, then track their progress. This standalone repository retains the capstone's development history; the original coursework copy is preserved.

![Application on Azure](screenshots/terminal/cloud-before.png)

## Architecture

```text
GitHub → Actions → Tests + security gates → GHCR
                                            ↓
Terraform → Azure VM → K3s + Helm → Application
                                  ↑
                          Argo CD reconciliation

Browser → Ingress → React
              └── /api → FastAPI → PostgreSQL PVC
                            ↓
                      Prometheus → Grafana
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

For development, start PostgreSQL from Compose, run `alembic upgrade head` and `uvicorn app.main:app` in `backend/`, then `npm ci && npm run dev` in `frontend/`. Set `DATABASE_URL=postgresql+psycopg://taskboard:taskboard@localhost:5432/taskboard` for the backend. See [Compose](docker-compose.yml) for ports and health checks.

## Tests and delivery

```bash
python -m pip install -r backend/requirements-dev.txt
python -m pytest -v backend/tests
cd frontend
npm ci
npm run build
```

The [GitHub Actions workflow](.github/workflows/ci-cd.yml) runs API/migration tests, frontend builds, Bandit, pip-audit, npm audit, Trivy secret and image scans. Failed checks stop publication. Successful images are tagged with the source commit and deployed with Helm into a disposable Kubernetes cluster. Browser tests, HTTP Ingress, HPA load, monitoring and GitOps reconciliation are checked there too.

[Pipeline runs](https://github.com/karttikjangid/homework-tracker-capstone/actions) · [Backend package](https://github.com/users/karttikjangid/packages/container/package/homework-tracker-backend) · [Frontend package](https://github.com/users/karttikjangid/packages/container/package/homework-tracker-frontend)

## Cloud and Kubernetes

[Terraform](terraform/) creates the network, restricted SSH rule, public IP and a `Standard_B2als_v2` VM. Private variables, state and SSH keys stay outside Git. Use an SSH tunnel for the Kubernetes API.

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Fill in your subscription, public SSH key and SSH source IP.
terraform init
terraform validate
terraform plan
terraform apply
# After the demonstration:
terraform destroy
```

The [Helm chart](helm/taskboard/) includes two frontend and backend replicas, database storage, ConfigMap, Secret, probes, Ingress and CPU autoscaling. Alembic applies schema changes under a PostgreSQL advisory lock.

```bash
helm upgrade --install homework ./helm/taskboard -n session21 --create-namespace \
  --set backend.tag=<successful-commit-sha> --set frontend.tag=<successful-commit-sha> \
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
| Concurrent backend migration starts | Both replicas reached Alembic together | Serialize with a PostgreSQL advisory lock |
| Argo CD core reconciliation failed | No explicitly declared project | Apply the repository-scoped AppProject first |
| GitOps remained Progressing in CI | Internal Ingress had no external load-balancer address | Isolate reconciliation; test HTTP Ingress in the primary release |
| SSH timed out during the final cloud review | The allowed source IP had changed | Update only the restricted /32 SSH rule through Terraform |
| Image and Service failure exercises | Deliberately invalid image tag and Service selector | Inspect Pod events/EndpointSlices, correct each value and verify recovery |

The [troubleshooting script](scripts/troubleshoot.sh) records the intentional failure exercises. Earlier review evidence is retained in [screenshots](screenshots/README.md); current terminal captures include the commands, actual output and exit-status records. Final standalone pipeline and cleanup evidence are added after verification.

## Reference and lessons

Based on the instructor's [TaskBoard starter and rubric](https://github.com/Nency-Ravaliya/devops-heros/tree/main/session21-python). Assignment-specific fields, migrations, validation, browser error handling and delivery checks extend that reference. The project was developed with coding-assistant support.

The main lessons were to check raw test results as well as CI status, wait for database readiness, verify persistence through a browser, and destroy cloud resources after collecting evidence.
