# Bill-e

An intuitive and user-friendly expense tracker built with Next.js. This app helps users manage their finances by allowing them to track expenses and incomes, set budgets, and analyse transactions data through charts and insights. <br>
You can check out the live version at [bill-e.org](https://bill-e.org).

## Features

- **Dashboard with Insights:** Get a view of your finances through charts and insights about your transactions and budgets.
- **Add, Edit, Delete Transactions:** Track both expenses and incomes with ease.
- **Transaction Filtering:** Filter transactions by specific periods and use the search functionality to find transactions by name, amount or other details you added.
- **Budgets Management:** Set monthly/daily/weekly or yearly budgets to keep track of your spending.
- **Customisable Categories:** Add and customise your own categories by choosing the icon and color.
- **Authentication:** Secure login and authentication using [Auth.js (NextAuth)](https://authjs.dev/).
- **Email Notifications:** Authentication emails are sent using [Resend](https://resend.com/).
- **Database:** The data is stored in a MySQL database.
- **Responsive Design:** The app is styled using [TailwindCSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/), ensuring a clean and responsive design across devices.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Next.js, Prisma ORM
- **Authentication:** Auth.js (NextAuth)
- **Database:** MySQL
- **Styling:** TailwindCSS, shadcn/ui
- **Deployment:** [Railway](https://railway.app/)

## Setup & Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/adriandoinea/bill-e.git
   cd bill-e
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in your environment variables.<br><br>

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open the app in your browser:**
   Navigate to http://localhost:3000 to view the app.

## Live Demo

You can find the live app at [bill-e.org](https://bill-e.org).
