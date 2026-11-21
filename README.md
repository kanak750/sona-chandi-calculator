# Sona Chandi Calculator 🟡⚪

A modern, luxury, mobile-first **Gold and Silver Rate Calculator** built with **React.js**, **Tailwind CSS**, and **Redux Persist** (`@reduxjs/toolkit`).

Designed specifically for personal use and jewellers, optimized for mobile phones, and ready for 1-click deployment on **Vercel**.

---

## ✨ Key Features

- **Separate Tabs for Gold & Silver**:
  - **🟡 Gold Calculator**: Standard Indian convention where rate is entered for **10 grams** (per 10g). Supports hallmark purities (24K fine bullion, 22K 916 standard jewellery, 18K, 14K, or Direct Rate).
  - **⚪ Silver Calculator**: Standard convention where rate is entered for **1 kilogram** (per 1kg / 1000g). Supports silver grades (999 Fine Bullion, 925 Sterling, 900 Traditional, 800 Utensil, or Direct Rate).
- **⏳ Automatic Next-Day Rate Expiry**:
  - Market rates fluctuate daily. Any rate set for today (e.g., 1st Dec) **automatically expires at midnight** (as soon as 2nd Dec begins).
  - The app automatically detects day rollover (even when kept open across midnight or resumed the next morning) and prompts you to enter fresh rates for the new day.
  - An **Edit Rate** option is always available throughout the day if market rates change.
- **📜 Past Entries & Records Tab (Redux Persist + LocalStorage)**:
  - All saved calculations persist permanently in your browser's `localStorage` via **Redux Persist** (records are never wiped when daily rates expire).
  - Portfolio metrics: Total Portfolio Value, Total Gold Weight, Total Silver Weight, and Entry count.
  - Search by Product Name, Item Type, or Date.
  - Filter by All, Gold only, or Silver only.
  - **View Breakdown / Receipt Modal**: Clean digital estimation slip with print support.
  - **Share to WhatsApp**: One-tap copy/share formatted message ready to send.
  - Individual item deletion & **Clear All** records button with safety confirmation dialog.
  - **Export to CSV**: Download your records as a spreadsheet.
- **🔨 Flexible Labour / Making Charges**:
  - `₹ Flat`: Fixed charge (e.g. ₹2,500).
  - `₹ / g`: Per-gram charge (e.g. ₹450 / gram).
  - `%`: Percentage of metal value (e.g. 10%).
- **⚖️ Weight Milligram Precision**:
  - Decimal precision up to 3 decimal places (milligrams, standard in jewelry).
  - Quick increment buttons (+1g, +5g, +10g, +50g, etc.).
- **📋 Optional 3% GST Toggle**: Standard jewellery GST in India.
- **📱 Native Mobile Experience**:
  - Segmented top tabs + bottom sticky navigation bar.
  - Dark / Light luxury themes.
  - Haptic feedback and touch-optimized buttons.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/)
- **Bundler & Dev Server**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **State Management & Persistence**: [Redux Toolkit](https://redux-toolkit.js.org/) + [Redux Persist](https://github.com/rt2zz/redux-persist) (saving to `localStorage`)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your mobile or desktop browser.

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## ☁️ How to Host on Vercel

### Method 1: Deploy via GitHub (Recommended)
1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Sona Chandi Calculator"
   git branch -M main
   git remote add origin https://github.com/<your-username>/sona-chandi-calculator.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com).
3. Click **"Add New"** > **"Project"**.
4. Select your GitHub repository.
5. Vercel will automatically detect **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Your site will be live on `https://your-project.vercel.app` in under 1 minute!

### Method 2: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the interactive prompts to deploy directly from your terminal.

---

## 🧪 Testing the Next-Day Expiry Feature
To test that rates disappear on the next day without having to wait until midnight:
1. Tap the **Edit / Sliders** button in the top bar to open the **Market Rates** modal.
2. Tap the **"🧪 Simulate Tomorrow (Test Expiry)"** button.
3. The app will immediately trigger date rollover, clearing today's rates, showing the "Today's rate not set / expired" warning banner, while keeping all your saved past records in the Records tab intact!
