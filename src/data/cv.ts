// Portfolio content transcribed from the active sections of /cv.tex.
export const profile = {
  name: "Oleksandr Kovalyk Borodyak",
  role: "Telematics Engineer",
  email: "oleksandr.kovalyk8@gmail.com",
  linkedin: "https://www.linkedin.com/in/oleksnadr-kovalyk-4a5861213",
  orcid: "https://orcid.org/0000-0003-4815-8248",
  summary:
    "I am passionate about technology and innovation. I am responsible, adaptable, and quick to learn, and I enjoy working in a team and contributing new ideas. I take initiative and look for new challenges and opportunities to grow professionally. I love tinkering with technology beyond my field of study. In my free time, I enjoy sports, especially weightlifting.",
};

export const skills = [
  { label: "Programming", value: "Python, SQL" },
  {
    label: "Development",
    value:
      "XGBoost, Scikit-learn, Pandas, NumPy, Matplotlib, Seaborn, Keras, TensorFlow, PyTorch",
  },
  { label: "Tools", value: "Git, GitHub, PostgreSQL, MinIO, MLflow, Neovim" },
  { label: "Other", value: "Docker, Kubernetes, Linux, Proxmox, LaTeX" },
];

export const education = [
  {
    degree: "Master’s Degree in Telematics Engineering",
    institution: "Technical University of Cartagena",
    year: "2021",
  },
  {
    degree: "Bachelor’s Degree in Telematics Engineering",
    institution: "Technical University of Cartagena",
    year: "2020",
  },
];

const lifeProjectUrl =
  "https://webgate.ec.europa.eu/life/publicWebsite/project/LIFE20-ENV-ES-000387/reducing-the-impact-of-underwater-noise-on-the-marine-environment-of-the-port-of-cartagena";

export const experience = [
  {
    role: "Research Assistant",
    organization: "Technical University of Cartagena & EU Life Project",
    // The experience entry has no dates; the associated project supplies these.
    period: "March 2022 — Present",
    description:
      "Reducing the impact of underwater noise on the marine environment of the Port of Cartagena.",
    funding: "",
    url: lifeProjectUrl,
  },
  {
    role: "Research Assistant",
    organization: "Technical University of Cartagena & MTorres",
    period: "February 2022 — May 2023",
    description:
      "Detection of carbon fiber wrapping failures using images from a profilometer.",
    funding: "",
    url: "",
  },
  {
    role: "Research Assistant",
    organization:
      "Technical University of Cartagena & Hospital General Universitario Reina Sofía",
    period: "December 2019 — December 2020",
    description:
      "Automatic extraction of optic nerve features from both eyes using image processing and statistical pattern recognition for integration in a telemedicine computer-aided diagnosis (CAD) application.",
    funding:
      "Partially funded by Spanish national projects AES2017-PI17/00771 and AES2017-PI17/00821 (Instituto de Salud Carlos III), and regional project 20901/PI/18 (Fundación Séneca).",
    url: "",
  },
];

export const projects = [
  {
    title: "Underwater noise monitoring in the Port of Cartagena",
    category: "Software Development",
    organization: "Technical University of Cartagena & EU Life Project",
    period: "March 2022 — Present",
    stack: "Python, Docker, Docker Compose, MinIO, PostgreSQL",
    description:
      "A microservices-based system that captures data from two hydrophones and an AIS system, stores it in a database, processes noise levels and associates them with AIS data, and exposes the results through a REST API. Deployment uses Docker Compose.",
    url: lifeProjectUrl,
  },
  {
    title: "Carbon fiber wrapping failure detection",
    category: "Machine Learning",
    organization: "Technical University of Cartagena & MTorres",
    period: "February 2022 — May 2023",
    stack: "Python, Keras, TensorFlow, RetinaNet",
    description:
      "A model and pipeline to detect carbon fiber wrapping failures in profilometer images, covering data analysis and preprocessing, metric selection, RetinaNet training, hyperparameter tuning, and final evaluation.",
    url: "",
  },
  {
    title: "Binocular optic nerve feature extraction",
    category: "Machine Learning",
    organization:
      "Technical University of Cartagena & Hospital General Universitario Reina Sofía",
    period: "December 2019 — December 2020",
    stack: "Python, Keras, TensorFlow",
    description:
      "Curated a hospital dataset and developed a deep-learning application that uses two ocular fundus images for glaucoma diagnosis, as part of a telemedicine CAD project for automatic optic nerve feature extraction.",
    url: "",
  },
  {
    title: "Kubernetes cluster on Proxmox",
    category: "Personal Project",
    organization: "Personal",
    period: "",
    stack: "Ansible, Kubernetes, Proxmox, Docker",
    description:
      "Built a Kubernetes cluster on Proxmox with virtual machines managed through Ansible to replicate real-world machine-learning model deployment. The cluster also serves as a playground for learning Kafka, Spark, Delta Lake, and other technologies.",
    url: "",
  },
];

export const publications = [
  {
    title:
      "Decision trees for glaucoma screening based on the asymmetry of the retinal nerve fiber layer in optical coherence tomography",
    publisher: "MDPI",
    date: "June 2022",
    doi: "10.3390/s22134842",
    authors:
      "Rafael Berenguer-Vidal; Rafael Verdú-Monedero; Juan Morales-Sánchez; Inmaculada Sellés-Navarro; Oleksandr Kovalyk; José-Luis Sancho-Gómez",
  },
  {
    title:
      "Improving glaucoma diagnosis assembling deep networks and voting schemes",
    publisher: "MDPI",
    date: "June 2022",
    doi: "10.3390/diagnostics12061382",
    authors:
      "Adrian Sánchez-Morales; Juan Morales-Sánchez; Oleksandr Kovalyk; Rafael Verdú-Monedero; José-Luis Sancho-Gómez",
  },
  {
    title:
      "PAPILA: Dataset with fundus images and clinical data of both eyes of the same patient for glaucoma assessment",
    publisher: "Nature",
    date: "June 2022",
    doi: "10.1038/s41597-022-01388-1",
    authors:
      "Oleksandr Kovalyk; Juan Morales-Sánchez; Rafael Verdú-Monedero; Inmaculada Sellés-Navarro; Ana Palazón-Cabanes; José-Luis Sancho-Gómez",
  },
];

export const conferences = [
  {
    title:
      "Analysis of the asymmetry in RNFL thickness using Spectralis OCT measurements in healthy and glaucoma patients",
    category: "International",
    event:
      "9th International Work-Conference on the Interplay Between Natural and Artificial Computation",
    location: "Puerto de la Cruz, Tenerife, Spain",
    date: "May 31 — June 3, 2022",
    organizer: "",
    publisher: "Springer",
    doi: "10.1007/978-3-031-06242-1_50",
    authors:
      "Rafael Berenguer-Vidal; Rafael Verdú-Monedero; Juan Morales-Sánchez; Inmaculada Sellés-Navarro; Oleksandr Kovalyk",
  },
  {
    title:
      "Automatic Instance Segmentation Applied to Retinography for Optic Disc and Cup Segmentation",
    category: "National",
    event:
      "XXXVIII Annual Congress of the Spanish Society of Biomedical Engineering",
    location: "Valladolid, Castilla y León, Spain",
    date: "November 25–27, 2020",
    organizer: "University of Valladolid",
    publisher: "",
    doi: "",
    authors:
      "Oleksandr Kovalyk; Juan Morales-Sánchez; Rafael Verdú-Monedero; Inmaculada Sellés-Navarro",
  },
  {
    title:
      "Application of MobileNet for early diagnosis of glaucoma: a binocular approach",
    category: "National",
    event:
      "XLI Annual Congress of the Spanish Society of Biomedical Engineering",
    location: "Cartagena, Murcia, Spain",
    date: "November 22–24, 2023",
    organizer: "Technical University of Cartagena",
    publisher: "",
    doi: "",
    authors:
      "Oleksandr Kovalyk; Juan Morales-Sánchez; Rafael Verdú-Monedero; Inmaculada Sellés-Navarro; José-Luis Sancho-Gómez",
  },
];
