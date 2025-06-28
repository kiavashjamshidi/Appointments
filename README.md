# 🗓️ CareCalendar — Patient Appointment Manager

CareCalendar is a calendar-based patient appointment management system built for healthcare providers, therapists, and care institutions. It includes support for calendar views, patient records, filtering, categories, and detailed appointment management.

---

## 🚀 Features

- 📅 Month, Week, and List Views
- 🧑‍⚕️ Link Appointments to Patients (with care level, pronouns, active status)
- 🏷️ Appointment Categories (with color, icon, description)
- 📍 Add Location, Notes, and Attachments
- 🔍 Filter by Category, Patient, or Date Range
- ✏️ Create, Edit, and Delete Appointments
- 🪟 Modal-based Appointment View + Edit
- 🧠 Hover Card Support (with shadcn)
- 🗂️ Fully Powered by Supabase

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **UI Components**: shadcn/ui (Radix-based component library)
- **State Management**: React Hooks

---

## 📦 Setup Instructions

### 1. Clone the Project

```bash
git clone https://github.com/YOUR_USERNAME/carecalendar.git
cd carecalendar
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Create the necessary tables:
   - `appointments`
   - `patients`
   - `categories`
3. Set up relationships (e.g., `appointment.category → categories.id`)
4. Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY`

### 4. Add Your `.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 5. Run Dev Server

```bash
npm run dev
```

---

## 📸 Screenshots

- Month View with daily sidebar
- Week Grid with hour positioning
- List View grouped by day
- Modal for appointment details
- Filter sidebar
- HoverCard tooltips (via shadcn)
