# Session 21 requirements cross-check

Sources checked read-only: the [course homework document](https://docs.google.com/document/d/1cjXFYf2Thm8cBEN-0C48B-v02cj3jGLd47lcO18prHE/edit), the [capstone repository](https://github.com/Nency-Ravaliya/devsecops-python), its [submission instructions](https://github.com/Nency-Ravaliya/devsecops-python/blob/main/SUBMISSION.md), and [grading rubric](grading.md).

The course document requires the complete DevOps flow, Terraform cloud infrastructure, Kubernetes resources, security gates, monitoring, GitOps, troubleshooting and screenshots. The capstone has its own repository, with the application and delivery components at its root. It was copied from the coursework repository; the original work is retained.

| Requirement | Implementation |
| --- | --- |
| Own application | Course-assignment tracker with session, due date, priority, assignee, status and CRUD |
| Git/GitHub | Public repository and SHA-tagged release history |
| Build/test | Eleven isolated API/migration tests, frontend build and browser checks |
| Docker | Non-root frontend/backend Dockerfiles; three-service Compose stack |
| CI/CD | GitHub Actions tests, builds, scans, pushes and Helm deployment |
| DevSecOps | Bandit, pip-audit, npm audit, Trivy secrets/images and failing security gates |
| Terraform/cloud | Azure VNet, two subnets, NSG, VM and public IP; apply and destroy |
| Kubernetes/Helm | Deployments, Services, ConfigMap, Secret, Ingress, HPA, probes and PostgreSQL PVC |
| Observability | Application logs, Prometheus metrics/targets and Grafana dashboard |
| GitOps | Argo CD project/Application, Git release values, reconciliation and self-healing |
| Troubleshooting | Deliberately broken image/Service; investigation, fixes and verification |
| Final demonstration | Committed slides in `demo/`, architecture diagram and key learnings; narrated video with source tour and recorded deployment evidence |

The general course document specifies Terraform cloud infrastructure. The reference grading rubric specifically names AWS VPC/EKS. This submission deliberately uses Azure/K3s, as requested; it does not claim to provision AWS or managed EKS.

The course reference and work from other sessions were not edited for this cross-check.

The current M10 rubric requires a committed slide deck and a presentation video. [Demo materials](../../demo/README.md) include both slide formats and the narrated video. The video uses recorded deployment evidence; acceptance as the required live walkthrough remains unconfirmed. The [earlier course rubric](grading-session21-reference.md) is retained.
