# Streamline: Personal Subscription Tracker

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Subhankar-Patra1/Ott-Platforms-Subscription-Tracker)

Streamline is a visually stunning, minimalist web application designed to help users effortlessly track their Over-The-Top (OTT) media subscriptions. The application provides a clean, single-page dashboard to view all active subscriptions, their associated costs, and upcoming renewal dates. All data is persisted locally in the browser using localStorage, ensuring privacy and speed. The user experience is enhanced with smooth animations and a sophisticated dark-mode-first design.

## Key Features

- **Centralized Dashboard:** View all your OTT subscriptions in a single, elegant interface.
- **Cost Summaries:** Instantly see your total monthly and annual subscription expenses.
- **Easy Management:** Add, edit, and delete subscriptions with a simple and intuitive user flow.
- **Pre-defined Platform List:** Quickly add subscriptions from a curated list of popular services like Netflix, Disney+, and more.
- **Privacy First:** All your subscription data is stored securely in your browser's `localStorage`. No data ever leaves your device.
- **Visually Polished:** A beautiful, dark-mode-first design with smooth animations and a focus on user experience.
- **Fully Responsive:** Flawless performance and layout on desktops, tablets, and mobile devices.

## Technology Stack

- **Framework:** [React](https://react.dev/) (with [Vite](https://vitejs.dev/))
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Form Handling & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Date Utilities:** [date-fns](https://date-fns.org/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Bun](https://bun.sh/) installed on your machine.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/streamline.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd streamline
    ```

3.  **Install dependencies:**
    ```bash
    bun install
    ```

### Running the Development Server

To start the local development server, run the following command:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

## Usage

- **Adding a Subscription:** Click the "Add Subscription" button to open a dialog. Select a service, fill in your plan details, cost, and renewal date, then click "Save".
- **Managing Subscriptions:** Hover over any subscription card to reveal the "Edit" and "Delete" options.
- **Viewing Costs:** The summary cards at the top of the dashboard will automatically update to reflect your total monthly and annual costs.

## Deployment

This project is optimized for deployment on the Cloudflare network.

### Deploying with Wrangler

1.  **Login to Wrangler:**
    If you haven't already, authenticate Wrangler with your Cloudflare account.
    ```bash
    bunx wrangler login
    ```

2.  **Build the project:**
    ```bash
    bun run build
    ```

3.  **Deploy the application:**
    ```bash
    bun run deploy
    ```

Wrangler will handle the deployment process and provide you with a live URL for your application.

### One-Click Deploy to Cloudflare

You can also deploy this project to Cloudflare with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Subhankar-Patra1/Ott-Platforms-Subscription-Tracker)

## Contributing

Contributions are welcome! If you have suggestions for improving the application, please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.