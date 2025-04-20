Multi-Actor E-commerce System Documentation
=============================================

Table of Contents
-----------------
1. Introduction  
   1.1. Project Overview & Objectives  
   1.2. Key Actors & Access Levels  
2. System Architecture & Technologies  
   2.1. Overview of Technologies and Tools  
   2.2. Data Flow and Component Interactions  
3. User Authentication & Access Levels  
   3.1. Authorization Mechanisms  
   3.2. Role-Based Access (Customers, Sellers, Admins)  
4. UI/UX and Navigational Structure  
   4.1. Home Page  
   4.2. Product Catalog  
   4.3. Product Details Page  
5. Core Functionalities  
   5.1. Shopping Cart  
   5.2. Checkout Process  
   5.3. Seller Dashboard  
   5.4. Admin Panel  
6. Installation and Setup  
   6.1. Prerequisites  
   6.2. Repository Cloning & Branching (GitHub Repository)  
   6.3. Running the System Locally  
7. Code Structure and Contribution Guidelines  
   7.1. Code Organization  
   7.2. Naming Conventions  
   7.3. Branching Strategy  
8. Detailed Usage Guidelines  
   8.1. For Customers  
   8.2. For Sellers  
   8.3. For Admins  
9. Additional Features and Customizations  
   9.1. Data Visualization Integration  
   9.2. Extending Functionalities  
10. Appendices  
   10.1. Glossary  
   10.2. Troubleshooting & FAQ  

--------------------------------------------------------------------------------

1. Introduction
---------------
**Project Title:** Multi-Actor E-commerce System  
**Objective:**  
Develop a comprehensive e-commerce system using HTML, CSS, JavaScript, and Bootstrap. The system is designed to support three primary actors (Customers, Sellers, and Admins) with specific functionalities and access levels.  

**Project Duration:**  
From 18/4/2025 to 2/5/2025

**Key Actors:**  
- **Customers:** Can browse products, add items to the cart, and complete purchases.  
- **Sellers:** Manage their products, process orders, and view sales analytics.  
- **Admins:** Have full access, enabling them to manage user accounts, moderate product listings, and assist with customer service.

--------------------------------------------------------------------------------

2. System Architecture & Technologies
---------------------------------------
**2.1. Overview of Technologies and Tools:**  
- **HTML:** Structures each page (home page, catalog, product details, etc.).  
- **CSS & Bootstrap:** Style the pages for a clean, responsive design using Bootstrap’s grid system.  
- **JavaScript:** Adds dynamic interactions such as updating the cart and handling form submissions.  
- **Local Storage:** Manages local data persistence for products, user sessions, and orders.  
- **Visualization Libraries:** Options include D3.js, Chart.js, or similar libraries for data visualization.

**2.2. Data Flow and Component Interactions:**  
Consider integrating a diagram (manually drawn or with a tool) to illustrate the following interactions:  
- User actions (search, add to cart, checkout) triggering JavaScript events.  
- Communication between the UI components and local storage.  
- Data management flows for different user roles.

--------------------------------------------------------------------------------

3. User Authentication & Access Levels
----------------------------------------
**3.1. Authorization Mechanisms:**  
- Implement secure user authentication to differentiate between Customers, Sellers, and Admins.  
- Use role-based access control to limit functionalities based on user type.

**3.2. Role-Based Access:**  
- **Customers:** Standard user access with the ability to browse products, transact, and manage personal details.  
- **Sellers:** Additional options to add, edit, and delete products, as well as manage orders and view analytics.  
- **Admins:** Full system access, including user account management and moderation features.

--------------------------------------------------------------------------------

4. UI/UX and Navigational Structure
-------------------------------------
**4.1. Home Page:**  
- Display featured products and promotions.  
- Use Bootstrap components for a modern and responsive layout.

**4.2. Product Catalog:**  
- Organized list of products with details (name, image, price, etc.).  
- Include an "Add to Cart" button for quick actions.

**4.3. Product Details Page:**  
- Detailed information about each product, including additional images and descriptive options.  
- Provide a "Back to Catalog" button to facilitate easy navigation.

--------------------------------------------------------------------------------

5. Core Functionalities
------------------------
**5.1. Shopping Cart:**  
- Allow customers to add, remove, and update items in their cart.  
- Display current items, quantities, prices, and the total cost.

**5.2. Checkout Process:**  
- A streamlined form for entering shipping and payment details.  
- Provide a final order summary prior to purchase confirmation.

**5.3. Seller Dashboard:**  
- Dashboard features for managing products, processing orders, and reviewing sales analytics.  
- Functionality to add, edit, or delete product listings.

**5.4. Admin Panel:**  
- Comprehensive access to all features, including managing user accounts and moderating product content.  
- Tools for handling customer service tasks and reviews.

--------------------------------------------------------------------------------

6. Installation and Setup
--------------------------
**6.1. Prerequisites:**  
- A modern web browser.  
- (Optionally) Node.js and a package manager (npm or yarn) if your setup requires a local server.

**6.2. Repository Cloning & Branching:**  
Follow these steps to clone the GitHub repository and set up your development environment:
  
```bash
# Clone the repository
git clone https://github.com/your-repository/multi-actor-ecommerce.git

# Navigate into the directory
cd multi-actor-ecommerce

# (Optional) Install dependencies if using node packages
npm install
