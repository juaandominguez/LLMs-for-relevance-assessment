# Relevance Assessment Platform & LLM Experimentation

This repository serves a dual purpose: it hosts a web-based platform for human relevance assessments and provides tools and scripts for preprocessing, inferencing, and fine-tuning Large Language Models (LLMs) on TREC datasets. This setup enables a complete workflow from data preparation and LLM experimentation to human evaluation of relevance.

---

## Features

### Relevance Assessment Web Application (`assessment-app/`)

* **User Authentication**: Secure login via GitHub, Google, or email/password credentials. It also supports guest access for quick assessments.
* **Relevance Assessment Interface**: An intuitive interface for evaluating document-topic pairs using a scoring system (0-2).
* **Assessment Guidelines**: Clear guidelines are available within the assessment interface to ensure consistent evaluations.
* **User Role Management**: The platform appears to support different user roles, likely for managing access and permissions, implied by the `getUserRole` action.
* **Persistence**: It uses Drizzle ORM with PostgreSQL for robust data storage of user information and assessment results.

### LLM Experimentation & Data Processing (`src/`, `scripts/`, `docker/`)

* **TREC Dataset Handling**: Includes tools for working with TREC (Text REtrieval Conference) datasets, which are crucial for information retrieval research.
* **Preprocessing**: Features scripts designed to prepare raw text data for LLM training and inference.
* **Inference**: Provides functionality for running pre-trained LLMs on datasets to generate relevance scores or other outputs.
* **Fine-tuning**: Contains scripts and configurations for adapting LLMs to specific relevance assessment tasks, aiming to improve their performance on TREC datasets.
* **Dockerized Environment**: Offers containerized setups for consistent and reproducible LLM experimentation, especially useful for environments like Slurm clusters.

---

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

Before you begin, make sure you have the following installed:

* **Bun**: A fast all-in-one JavaScript runtime (primarily for the `assessment-app`).
* **Docker**: For building and managing Docker images (essential for the `docker/` component and potentially for LLM experimentation).
* **PostgreSQL**: A relational database for storing `assessment-app` data.
* **Python**: Required for the LLM processing scripts (`src/`, `scripts/`).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [repository-url]
    cd [repository-name]
    ```

2.  **Web Application Setup (`assessment-app/`)**

    * Navigate to the web application directory:
        ```bash
        cd assessment-app
        ```
    * Install dependencies:
        ```bash
        bun install
        ```
    * Set up **environment variables**:
        Create a `.env` file in the `assessment-app` directory. Here's an example of what it might contain:
        ```
        # PostgreSQL Database URL
        POSTGRES_URL="postgresql://user:password@host:port/database"

        # NextAuth.js Configuration
        AUTH_SECRET="your_nextauth_secret" # Generate a strong, random string
        AUTH_URL="http://localhost:3000" # Your application's URL

        # Optional: GitHub Provider (if enabled)
        GITHUB_ID="your_github_client_id"
        GITHUB_SECRET="your_github_client_secret"

        # Optional: Google Provider (if enabled)
        GOOGLE_ID="your_google_client_id"
        GOOGLE_SECRET="your_google_client_secret"
        ```
        **Tip:** For `AUTH_SECRET`, you can generate a secure string using `openssl rand -base64 32`.
    * Run Drizzle migrations to set up your database schema:
        ```bash
        bun drizzle-kit push:pg
        ```

3.  **LLM Experimentation Setup (`src/`, `scripts/`, `docker/`)**

    * **Docker Image Build**: The `buildspec.yml` outlines the process for building and pushing a Docker image, likely for Slurm-based LLM processing. You'll need to configure your Docker environment and provide credentials for your Docker registry.
        ```bash
        # This is how the Docker image is built and pushed as per buildspec.yml.
        # Ensure DOCKER_TOKEN, DOCKER_REGISTRY, and DOCKER_USERNAME are set in your environment variables.
        # echo "$DOCKER_TOKEN" | docker login "$DOCKER_REGISTRY" -u "$DOCKER_USERNAME" --password-stdin
        # docker build -t "$DOCKER_REGISTRY"/irlab/slurm_images:trec-llm docker -f docker/Dockerfile
        # docker push "$DOCKER_REGISTRY"/irlab/slurm_images:trec-llm
        ```
    * **Python Dependencies**: Navigate to the root of the repository and install any necessary Python dependencies for the LLM scripts. You'll likely find a `requirements.txt` or `pyproject.toml` file to guide this process.
        ```bash
        # Example:
        # pip install -r requirements.txt
        ```

### Running the Applications & Experiments

* **Run the Web Application**:
    ```bash
    cd assessment-app
    bun run dev
    ```
    The application will be accessible at `http://localhost:3000`.

* **Run LLM Experiments**:
    ```bash
    #Modify paths first
    python scripts/generate_prompts.py
    python scripts/stratified_sampling.py
    python scripts/generate_prompts.py
    python src/inference.py
    ```

---

## Project Structure

* **`assessment-app/`**: Contains the main Next.js application for the human relevance assessment platform.
    * `app/`: Next.js application routes, layouts, and pages.
    * `auth.ts`: NextAuth.js configuration for authentication.
    * `db/`: Drizzle ORM schema and database queries.
    * `components/ui/`: Reusable UI components built with Shadcn UI.
    * `public/`: Static assets.
    * `__test__/`: Unit tests for UI components using Bun's test runner and React Testing Library.
    * `e2e/`: End-to-end tests using Playwright.
    * `drizzle.config.ts`: Drizzle ORM configuration.
    * `next.config.ts`: Next.js specific configurations.
    * `tailwind.config.ts`, `postcss.config.mjs`, `globals.css`: Tailwind CSS configuration and global styles.
    * `types.ts`: TypeScript type definitions for the application.
* **`src/`**: Houses the core source code for LLM-related functionalities, such as model definitions, data loaders, and training loops.
* **`scripts/`**: Contains executable scripts for various LLM-related tasks, including data preprocessing, running inference, or fine-tuning.
* **`docker/`**: Includes Dockerfiles and associated assets for building container images, particularly for deploying LLM workflows (e.g., `irlab/slurm_images:trec-llm`).
* **`buildspec.yml`**: An AWS CodeBuild specification for automating the build and push of Docker images to a Docker registry.

---

## Technologies Used

### Web Application (`assessment-app/`)

* **Next.js**: React framework for building server-rendered and static web applications.
* **React**: JavaScript library for building user interfaces.
* **Bun**: Fast all-in-one JavaScript runtime for development and testing.
* **NextAuth.js**: Authentication library for Next.js applications, supporting various providers.
* **Drizzle ORM**: TypeScript ORM for PostgreSQL.
* **PostgreSQL**: Relational database.
* **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
* **Shadcn UI**: Re-usable components built using Radix UI and Tailwind CSS.
* **Bun Test Runner**: For unit testing.
* **Playwright**: For end-to-end testing.
* **Happy DOM**: A JavaScript DOM implementation for testing.
* **Zod**: TypeScript-first schema declaration and validation library.
* **React Hook Form**: For form management with easy validation.

### LLM Experimentation

* **Python**: The primary language used for LLM processing.
* **PyTorch / TensorFlow / Hugging Face Transformers**: (Likely) Common libraries for LLM development.
* **Docker**: Used for containerizing LLM environments.
* **Slurm**: (Implied by `slurm_images`) A workload manager for high-performance computing clusters, often used for distributed LLM training.

---

## Contributing

Contributions are always welcome! Please feel free to open issues or submit pull requests.

---

## License

 Apache 2.0 license strikes an excellent balance between openness and protection. It maximizes the potential for adoption and commercial use for the project, provides essential patent protection, ensures proper attribution, and is widely accepted within the tech and research communities.
