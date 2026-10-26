# Capstone demonstration

[Slides (PDF)](slides.pdf) · [PowerPoint with speaker notes](presentation.pptx) · [Voice recording script](recording-script.md)

The 17-slide deck includes the architecture diagram, application, delivery pipeline, Azure infrastructure, Kubernetes, monitoring, troubleshooting and key learnings.

## Video

[Watch or download the captioned preview](https://github.com/karttikjangid/homework-tracker-capstone/releases/download/demo-2026-10-26/presentation-video.mp4).

The preview starts with the slides, then a source-code tour recorded on 26 October 2026. The deployment sections use the original October verification recordings. Captions identify recorded footage and any playback speed changes. [Chapter markers](chapters.md) separate the sections. This preview has no voice track yet.

Azure resources were removed after verification. The video preserves that deployment evidence and does not show a fresh live Azure deployment. CI verifies Helm and GitOps in an isolated Kind cluster. Azure uses K3s; the instructor's reference uses AWS/EKS.

## Adding narration

Record the [script](recording-script.md) using Voice Memos or QuickTime. Speak naturally, say each section number, and leave two seconds between sections. Export one M4A, MP3 or WAV file. The section numbers and pauses allow the voice track to be aligned and the slide timings adjusted.

The existing [walkthrough and original recordings](../docs/walkthrough.md) remain available. The presentation preview uses edited recorded evidence; instructor acceptance of that format and the Azure substitution remains unconfirmed.

## Instructor requirements

[Submission instructions](https://github.com/Nency-Ravaliya/devsecops-python/blob/main/SUBMISSION.md) · [Grading rubric](https://github.com/Nency-Ravaliya/devsecops-python/blob/main/GRADING.md)

The instructor requires slides first, then the codebase, CI/CD, infrastructure, Argo CD, Kubernetes, Prometheus and Grafana. Slides must be committed to Git. The video may be stored in Git or as a release asset. A fresh live walkthrough is still required if the instructor does not accept an edited recording.
