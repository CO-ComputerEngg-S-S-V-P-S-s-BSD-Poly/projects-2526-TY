<h1>1. Project Title: </h1>Krushi Sakha
<p><h2>2. Project description: </h2>Krushi Sakha is an Android-based platform that empowers registered farmers with a scientific, end-to-end roadmap for complete crop management. By guiding users through a structured 5-pillar "Crop Loop"—from pre-sowing preparation to scientific storage—the application bridges the agricultural knowledge gap to optimize yields and prevent financial loss.</p>
<h1>3. Group no: </h1>11
<p><h1>4. Team members: </h1>1. Gujar Jayesh Nagesh <br>
  2. Kor Darshan Pruthviraj <br>
  3. Puranik Amay Tushar <br>
  4. Patil Krish Chandrashekhar </p>
<p><h1>5. Tech stack: </h1>Here is the technical stack and architecture driving the Krushi Sakha application:
​Frontend & Mobile Environment
​Platform: Native Android
​IDE: Android Studio
​Language: Java
​UI Design: XML layouts
​Backend & Cloud Services (Google Firebase)
​Authentication: Firebase Authentication (Managing secure logins for both Farmers and Admins/Experts)
​Database: Firebase Realtime Database (Using a NoSQL JSON structure)
​Media Storage: Firebase Storage (For housing high-quality pest/disease photos and agricultural case studies)</p>
<p><h1>6. Project Structure: </h1>## 📂 Project Directory Structure

The application follows a standard Android MVC/MVVM hybrid architecture, isolating UI controllers, data models, and backend network logic. This ensures a clean separation of concerns for role-based access and backend synchronization.

```text
KrushiSakha/
│
├── app/                                  # Main application module
│   ├── src/main/
│   │   ├── java/com/project/krushisakha/ # Core Java Source Code
│   │   │   ├── activities/               # UI Controllers & Routing
│   │   │   │   ├── splash/               # Splash screen and initialization
│   │   │   │   ├── auth/                 # Role-Based Authentication Flow
│   │   │   │   │   ├── FarmerLoginActivity.java
│   │   │   │   │   ├── FarmerRegisterActivity.java
│   │   │   │   │   └── AdminLoginActivity.java
│   │   │   │   ├── farmer/               # Authenticated farmer views (Read-Only)
│   │   │   │   └── admin/                # Admin portal (Data-Entry Privileges)
│   │   │   │
│   │   │   ├── adapters/                 # RecyclerView Adapters
│   │   │   │   ├── CropListAdapter.java  # Implements TextWatcher filtering for Search
│   │   │   │   └── DiseaseAdapter.java   # Nested RecyclerView adapter for Pillar 4
│   │   │   │
│   │   │   ├── models/                   # POJO classes for Firebase JSON mapping
│   │   │   │   ├── User.java             # Handles role verification (Farmer vs Admin)
│   │   │   │   ├── Crop.java             # Flattened model for the 5-Pillar data
│   │   │   │   └── Disease.java          # Model for Crop Protection mapping
│   │   │   │
│   │   │   ├── network/                  # Database and API handling
│   │   │   │   └── FirebaseHelper.java   # Centralized DB logic, Disk Persistence config
│   │   │   │
│   │   │   └── utils/                    # Helper classes
│   │   │       ├── GlideUtils.java       # Centralized image loading and memory management
│   │   │       └── Constants.java        # Static Firebase node keys and shared constants
│   │   │
│   │   ├── res/                          # Android Resources
│   │   │   ├── layout/                   # XML UI definitions
│   │   │   └── values/                   # Strings, colors, and themes
│   │   │
│   │   └── AndroidManifest.xml           # App permissions and activity declarations
│   │
│   ├── build.gradle                      # App-level Gradle (Dependencies: Glide, Firebase)
│   └── google-services.json              # Firebase config file (MUST BE IN .gitignore)
│
├── build.gradle                          # Project-level Gradle
├── settings.gradle
└── .gitignore                            # Excludes IDE files, build caches, and API keys


</p>


<h1>7. Prerequisites and installation steps: </h1>## # 🌱 Krushi Sakha (Farmer's Friend)

## 📌 Project Abstract
**Krushi Sakha** is a highly optimized, native Android application engineered to bridge the critical knowledge gap in modern agriculture. Farmers currently face significant financial losses (up to 30-40%) due to a lack of scientific crop management, particularly in warehousing and disease mitigation. 

This application provides a rigorous, 5-stage scientific roadmap (The Crop Loop) for agricultural management. It utilizes a secure, role-based architecture separating read-only farmer access from administrative data-entry privileges, while guaranteeing offline resilience in rural zones via local database caching.

---

## 🏗️ Core Architecture: The Crop Loop (The 5 Pillars)
Every crop within the system adheres to a strict 5-pillar architectural framework, ensuring consistent and exhaustive data delivery:

1. **Pre-Sowing:** Soil requirements, climate suitability parameters, and land preparation methodologies.
2. **Sowing Management:** Optimal timing windows, precise seed rates, spacing metrics, and chemical seed treatments.
3. **Nutrient & Water Schedule:** Exact NPK fertilizer ratios and critical stage-based irrigation timing (e.g., Crown Root Initiation).
4. **Crop Protection:** High-resolution visual identification of pests and diseases mapped directly to their scientific chemical countermeasures.
5. **Storage:** Scientific warehousing protocols, including strict Temperature and Humidity thresholds to prevent post-harvest loss.

---

## 🛠️ Technical Stack & Implementation

### Frontend (Native Android)
* **Language:** Java (Android Studio)
* **Memory Management:** [Glide Library](https://github.com/bumptech/glide) - Implemented to asynchronously fetch, cache, and recycle high-resolution agricultural imagery from cloud storage without triggering OutOfMemory (OOM) exceptions.
* **Search Optimization:** `TextWatcher` integrated with `RecyclerView` for instantaneous, zero-latency, letter-by-letter filtering of the crop index.

### Backend (Google Firebase)
* **Database:** Firebase Realtime Database structured as a flattened NoSQL JSON tree for $O(1)$ read efficiency via `ValueEventListener`.
* **Storage:** Firebase Storage for hosting master crop and disease image assets.
* **Authentication:** Firebase Auth handling secure, role-based login routing for both Farmers and Admins.
* **Offline Resilience:** `FirebaseDatabase.getInstance().setPersistenceEnabled(true)` is strictly enforced. This caches the JSON tree locally, ensuring farmers retain full access to case studies in the field during network degradation.

---

## 📅 Phase-Wise Development Lifecycle (SDLC)

### Phase 1: Requirement Analysis & Planning
* **Problem Identification:** Recognizing that farmers face up to 30-40% financial loss due to a lack of scientific agricultural knowledge, particularly in warehousing and disease management.
* **Core Architecture Definition:** Establishing the **Crop Loop (The 5 Pillars)** as the mandatory blueprint for every crop.
* **Access Control Mapping:** Finalizing the mandatory role-based authentication requirement, strictly separating Farmer (Read-Only) and Admin/Expert (Read-Write) privileges.

### Phase 2: System Architecture & Database Design
* **Backend Selection:** Setting up Google Firebase as the central backend service.
* **NoSQL JSON Structuring:** Designing a flattened, highly optimized Realtime Database tree to handle the 5-Pillar data without deep, expensive queries.
* **Storage Strategy:** Configuring Firebase Storage to host high-quality crop and disease images securely.
* **Offline Protocol:** Architecting the implementation of Firebase Disk Persistence (`setPersistenceEnabled(true)`) so farmers can access cached case studies directly from the field without an internet connection.

### Phase 3: UI/UX & Frontend Design
* **Wireframing:** Designing a highly visual, easy-to-navigate interface.
* **Authentication Screens:** Building secure login and registration layouts for both Farmers and Admins.
* **Component Design:** Structuring custom `RecyclerView` layouts to display the list of crops seamlessly.
* **Nested Views:** Designing nested `RecyclerView` components specifically for Pillar 4 (Crop Protection) to display pest/disease images alongside their chemical solutions.

### Phase 4: Core Implementation & Integration (Coding Phase)
* **Database Syncing:** Implementing `ValueEventListener` to fetch and map Firebase NoSQL data into Native Java POJO classes.
* **Search Logic:** Coding a `TextWatcher` to enable rapid, letter-by-letter filtering of the crop `RecyclerView`.
* **Memory Management:** Integrating the **Glide Library** to efficiently load, cache, and recycle high-quality Firebase Storage images without causing OutOfMemory (OOM) errors on the device.
* **Role-Based Routing:** Implementing logic that checks the authenticated user's role upon login and routes them to either the Farmer Dashboard or the Admin Data Entry portal.

### Phase 5: Testing & Quality Assurance
* **Authentication Testing:** Verifying that a logged-in farmer absolutely cannot access the admin data-entry nodes.
* **Offline Testing:** Simulating field conditions by turning on Airplane Mode and verifying that the cached Firebase Disk Persistence data still loads perfectly.
* **UI/Performance Testing:** Scrolling through the nested `RecyclerView` lists to ensure Glide is properly handling image memory and the app is not dropping frames.
* **Data Validation:** Ensuring the 5 Pillars display the exact scientific measurements (e.g., specific NPK fertilizer ratios and temperature/humidity limits for storage).

### Phase 6: Deployment & Final Documentation
* **Repository Management:** Structuring the GitHub repository with a clean `.gitignore` to protect the `google-services.json` API keys.
* **README Generation:** Publishing comprehensive technical documentation detailing the tech stack, installation steps, and system architecture.
* **APK Generation:** Building the final, signed Android Package (APK) for distribution and live demonstration.
* **Report Compilation:** Assembling all phase documentation, system architecture diagrams, and literature reviews into the final project report.

---

## 🚀 Installation & Setup Guide

### 1. Prerequisites
* Java Development Kit (JDK) 17+
* Android Studio (Latest Stable)
* Android SDK API 24+ (Target API 34/35)

### 2. Local Environment Setup
```bash
# Clone the repository
git clone [https://github.com/YourUsername/KrushiSakha.git](https://github.com/YourUsername/KrushiSakha.git)

# Navigate into the project directory
cd KrushiSakha 
