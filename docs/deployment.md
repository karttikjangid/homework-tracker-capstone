# Deployment and operations

Run commands from the repository root unless a step specifies another directory.

Prerequisites: Azure CLI signed in to the intended subscription, Terraform, kubectl, Helm and an SSH key. Provisioning creates billable Azure resources; remove them after the demonstration.

CI deploys into a disposable Kind cluster. The cloud demonstration promotes the approved images to K3s on one Azure VM using Helm.

## Cloud and Kubernetes

[Terraform](../terraform) creates the network, restricted SSH rule, public IP and a `Standard_B2als_v2` VM. Private variables, state and SSH keys stay outside Git. Use an SSH tunnel for the Kubernetes API.

```bash
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
# Fill in your subscription, public SSH key and SSH source IP.
terraform -chdir=terraform init
terraform -chdir=terraform validate
terraform -chdir=terraform plan
terraform -chdir=terraform apply
```

Follow the [cluster connection steps](../terraform/README.md#connect-to-k3s-for-a-presentation) to set `VM_IP`, `SSH_KEY` and `KUBECONFIG`. Keep the SSH tunnel open.

The chart pulls the approved patched images from public GHCR. The v1.0.0 image archive is historical and predates the 27 October security update; it is not used for the current deployment.

The [Helm chart](../helm/taskboard) includes two frontend replicas and two to four backend replicas, database storage, ConfigMap, Secret, probes, Ingress and CPU autoscaling. Alembic applies schema changes under a PostgreSQL advisory lock.

```bash
helm upgrade --install homework ./helm/taskboard -n session21 --create-namespace \
  --set ingress.className=traefik --set ingress.host='' --wait
kubectl -n session21 get pods,svc,ingress,hpa,pvc
```

## Monitoring and GitOps

Prometheus scrapes FastAPI's `/metrics`; Grafana displays the request counter. The [monitoring values](../monitoring) provision the datasource and dashboard. Application logs come from `kubectl logs`. [HPA exercise](../scripts/test-hpa.sh) applies HTTP load and requires a real replica increase.

The [Argo CD Application](../gitops/application.yaml) reads this repository's Helm chart and committed image tags. Automatic sync, pruning and self-healing restore declared state. CI changes a replica count and checks that Argo restores it. Its separate namespace disables Ingress/HPA to isolate reconciliation from the primary release's networking and scaling tests.

## Monitoring commands

With the cluster connection open, install the checked monitoring configuration:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
helm upgrade --install session21-prometheus prometheus-community/prometheus \
  -n session21-monitoring --create-namespace -f monitoring/prometheus-values.yaml --wait
helm upgrade --install session21-grafana grafana/grafana \
  -n session21-monitoring -f monitoring/grafana-values.yaml --wait
kubectl -n session21-monitoring port-forward svc/session21-prometheus-server 9090:80
# In another terminal:
kubectl -n session21-monitoring port-forward svc/session21-grafana 3005:80
```

Open Prometheus at `http://localhost:9090` and Grafana at `http://localhost:3005`.
Retrieve Grafana's admin password locally from its Kubernetes Secret; keep it out of Git.

## GitOps ownership

Use the [Argo CD project](../gitops/project.yaml) and [Application](../gitops/application.yaml) for reconciliation. Promote an image by committing its successful pipeline SHA to [release values](../helm/taskboard/values-gitops.yaml). Revert that commit to request a rollback. Use Argo CD or manual Helm ownership for a given namespace. The CI exercise uses a separate namespace.

## Rollback and cleanup

```bash
helm history homework -n session21
helm rollback homework <revision> -n session21 --wait
kubectl -n session21 get pods
```

Check `/health`, the API and a browser reload after a rollback. Database migrations need a separate compatibility review; rolling back an image does not roll back PostgreSQL data.

After the demonstration, stop the port-forwards and SSH tunnel, then run:

```bash
terraform -chdir=terraform destroy
az group exists --name session21-homework
```

The existence check should return `false`. Keep Terraform state and SSH keys outside Git.
