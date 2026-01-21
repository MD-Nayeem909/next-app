# 📦 FastParcel - Enterprise Logistics & Dynamic Marketplace 🚀

**FastParcel** is a high-performance, full-stack logistics and e-commerce management system. Built with the latest **Next.js 16** and **React 19**, this platform demonstrates advanced implementation of Role-Based Access Control (RBAC), real-time data visualization, and a seamless user experience designed for a modern logistics ecosystem.

---

## 🚀 Recent Core Implementations

In the latest development phase, I focused on enhancing **User Experience (UX)** and **Real-time Data Synchronization**.

- **Role-Based Notification System:** Automated alerts for Admin (new bookings), Agents (assigned tasks), and Customers (status updates).
- **Real-time UI Syncing:** Integrated **TanStack Query (React Query)** for automatic background refetching, ensuring data is always fresh without manual reloads.
- **Intelligent Parcel Assignment:** Admin can assign parcels to agents with a single click, triggering instant notifications for all parties.
- **Responsive Dashboard UI:** Implemented a sophisticated, mobile-centered notification dropdown that adapts perfectly to any screen size.

---

## 🛠️ Technical Challenges & Solutions (The "Hard" Part)

As a developer, I faced several complex logic and UI hurdles. Here is how I solved them:

### 1. Handling Async Session Race Conditions

**Problem:** Fetching notifications before the user session was fully loaded caused `401 Unauthorized` errors.
**Solution:** Implemented **Conditional Fetching** using `enabled: !!user?.email` in React Query. This ensures the API only fires after the user's identity is verified.

### 2. Multi-Role Unified API Logic

**Problem:** Designing a single `PUT` API that behaves differently for Admin vs. Agent was tricky.
**Solution:** Developed a role-validated backend controller that checks `session.user.role`. It allows Admins to update `assignedAgentId` while restricting Agents to only update the parcel `status`.

### 3. Responsive Dropdown Clipping in Mobile

**Problem:** The notification dropdown was being cut off on mobile screens due to standard `absolute` positioning.
**Solution:** Solved using a combination of **`fixed` positioning** and **CSS transforms** (`left-1/2 -translate-x-1/2`). This keeps the dropdown perfectly centered on mobile while switching to `absolute` alignment on desktop.

### 4. Real-time Notification Management

**Problem:** Ensuring the "Unread Count" badge updates instantly when a user marks notifications as read.
**Solution:** Utilized **React Query's `invalidateQueries`** to trigger a manual refetch of the notification count immediately after a `PATCH` request, creating a seamless real-time experience.

---

## 🌟 Professional Highlights

### 🛡️ Secure Infrastructure & Authentication

- **Role-Based Access Control (RBAC):** Specialized logic for **Admins, Agents, and Customers** secured via Next-Auth and custom Middleware.
- **Form Validation & Schema:** Robust client-side and server-side validation using **React Hook Form** and **Zod**.
- **Secure Auth:** Password hashing using **Bcrypt.js** and secure JWT session management.

### 📊 Advanced Data Management

- **State Management:** Efficient server-state handling with **TanStack Query (React Query)** for caching and synchronized data fetching.
- **Product Ecosystem:** Full CRUD operations for product management with dynamic search, custom filtering, and pagination.
- **Interactive Analytics:** Real-time data visualization for logistics stats using **Recharts**.

### 🎨 High-End User Experience (UX/UI)

- **Modern Design:** Built with **Tailwind CSS 4.0** and **DaisyUI** for a clean, professional aesthetic.
- **Fluid Animations:** Smooth, GPU-accelerated transitions and interactive elements powered by **Framer Motion**.
- **Smart Feedback:** Integrated **SweetAlert2** for destructive actions and **React Hot Toast** for instant notifications.
- **UX Optimization:** Custom **Skeleton Loaders**, dynamic **Error Boundaries**, and a personalized **404 Not Found** experience.

---

## 🛠️ Technical Tech Stack

| Category             | Technology                            |
| :------------------- | :------------------------------------ |
| **Framework**        | Next.js 16 (App Router), React 19     |
| **Styling**          | Tailwind CSS 4, DaisyUI, Lucide React |
| **Database**         | Next.js API Routes, MongoDB Mongoose  |
| **Authentication:**  | NextAuth.js                           |
| **Data Fetching**    | TanStack Query v5                     |
| **Forms/Validation** | React Hook Form, Zod                  |
| **Visuals**          | Recharts, Framer Motion               |
| **Notifications**    | Custom Role-based Notification System |

---

## 🚀 Installation & Setup

Ensure you have **Node.js 18+** installed.

### 1. Clone & Install

```bash
git clone https://github.com/MD-Nayeem909/fast-parcel.git
cd fast-parcel
npm install
```

### 2. Configure Environment

Create a **.env.local** file in the root:

MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

````

### 3. Development Mode

```bash
npm run dev


## 📁 Key Architecture

├── src/
│   ├── app/          # App Router: Pages, API Routes, & Server Actions
│   ├── components/   # Atomic UI Components & Shared Layouts
│   ├── models/       # Mongoose Schemas (User, Product, Parcel)
│   ├── lib/          # Database Logic & Helper Utilities
│   ├── hooks/        # Custom TanStack Query Hooks
│   └── middleware.js # RBAC & Route Guard Logic
└── public/           # Optimized Assets & Branding

````

## 📈 Optimization Features

Speed Insights: Integrated @vercel/speed-insights for real-time performance tracking.

Date Handling: Efficient time-stamping and delivery scheduling using date-fns.

Atomic Components: Reusable UI elements for maintainability and scalability.
