# 🏆 Loyalty System Dashboard (Visualization)

A **React-based visualization app** built to demonstrate the **Loyalty System** I developed at **Meetus VR Company** using **Java Spring Boot** and **SQL databases**.  
This frontend is designed **only to visualize and showcase** the backend logic, integrations, and architecture of the loyalty system — including **Apple Wallet** and **Google Wallet** integration.

---

## 🚀 Overview

This React application serves as a **dashboard interface** to visualize the backend features of the loyalty system built for multiple organizations.  
Each organization has its own **tiers, offers, referral system, and reward configurations**, and users interact with the system through **wallet integrations and loyalty actions**.

---

## ✨ Key Features

### 🏢 Organization Dashboard (Admin Panel)
- Manage multiple organizations within one platform.
- Create, edit, and delete **loyalty tiers** (e.g., Bronze, Silver, Gold, Platinum).
- Configure tier rules and actions, such as:
  - Awarding points for orders above a specific amount.
  - Assigning points for completing actions (e.g., writing a product review).
- Manage **offers**, **discounts**, and **referral bonuses** per tier.
- View and track user activity, tier progress, and reward performance.

---

### 👥 User and Employee Login
- Each user logs in under their specific organization.
- Two main roles:
  - **Customer:** can view their points, tier, and wallet.
  - **Employee:** can manage loyalty wallet customization, referral QR codes, and wallet designs.

---

### 📱 Loyalty Wallet (Apple & Google Integration)
- Integrated with **Apple Wallet** and **Google Wallet** for digital loyalty cards.
- Wallet displays:
  - User **tier**, **points**, and **offers**.
  - **QR code** for referrals or in-store actions.
  - **PIN code** for redeeming discounts or points at checkout.
- Each tier has a **custom wallet design** (colors, branding, and reward info) controlled by the organization.

---

### 🧾 Wallet Scanning Section
- After logging in, users can **scan their digital loyalty wallet** through a QR code scanner built into the dashboard.
- This allows users to sync or verify their wallet details directly from the web interface.
- The scanned wallet displays current tier, total points, and available offers.

---

### 🎁 Referral & Reward System
- Employees can share unique referral QR codes.
- Points are awarded when:
  - A referred customer signs up.
  - A referred customer completes a purchase.
- Track referral count and total earned points.

---

### 🏬 Shop Check-In System
- Each shop branch has its own **QR code** for customer check-ins.
- Customers earn instant points for scanning the code upon entry.
- Customers can redeem points at checkout using their wallet **PIN code** for discounts.

---

