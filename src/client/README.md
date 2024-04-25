UMarket Website README
======================

This document provides an overview of the UMarket website, which is an e-commerce platform designed for UMass Amherst students to buy and sell items. Below are the setup instructions, a detailed project structure, and comprehensive operational guidance.

Contents:
---------
1. Project Structure
2. Setup Instructions
3. Documentation
4. Operating Instructions

1. Project Structure:
---------------------
- /index.html        : The homepage of the website, providing links to all major sections.
- /products.html     : Displays all products, with functionality to filter items by category.
- /sell.html         : Allows users to list items they wish to sell.
- /login.html        : Provides user login functionality.
- /signup.html       : Allows new users to create an account.
- /css/              : Contains all CSS styling files.
  - /login.css       : Styles specific to login and signup forms.
  - /styles.css      : Common styles used throughout the website.
- /js/               : Contains JavaScript files for dynamic functionality.
  - /script.js       : Main JavaScript file for site interactions.
  - /accounts.js     : Manages user accounts and authentication.
- /images/           : Hosts all images used on the website, including logos and product images.
- /README.txt        : Documentation file for the website.

2. Setup Instructions:
----------------------
To get the UMarket website running locally:
a. Clone the repository to your local machine.
b. Run command npm run milestone-02
c. Open the 'index.html' file in a modern web browser to start exploring the site.
d. No additional local server setup is required as the site uses PouchDB for client-side data storage, simplifying deployment and testing.

3. Documentation:
-----------------
- The website is organized into several main pages, each serving a specific function:
  - Home (index.html): Main landing page with links to all other sections.
  - Products (products.html): Browse all available products or filter by categories such as Books, Electronics, and Fashion.
  - Sell (sell.html): Form page for users to list new items for sale.
  - Login (login.html) and Signup (signup.html): Handle user authentication and account creation.
- Navigation is facilitated through a top navigation bar present on all pages, allowing easy access between sections.
- Responsive design ensures the website is accessible on a variety of devices, from desktops to mobile phones.

4. Operating Instructions:
--------------------------
**Creating an Account:**
- Navigate to the Signup page by clicking 'Create Account' on the login page.
- Enter your email and password.
- Click the 'Create Account' button twice to register (due to a current UI quirk).
- Once the account is created, navigate back to the Login page to verify and access your account.

**Logging In:**
- From the Login page, enter your registered email and password.
- Click the 'Login' button to access your account.

**Searching for Products:**
- From the Homepage, use the search bar to enter the name or category of the product you're interested in.
- Click the search icon or press enter to view the results.

**Exploring Products:**
- Click on 'Explore our products' on the Homepage.
- On the Products page, choose from categories like Books, Electronics, or Fashion to filter the items.

**Selling Products:**
- From any page, click on 'Become a Seller' in the navigation bar.
- In the Sell form, enter the item name, description, and set a price.
- Select the condition of the item (New or Used).
- To add pictures, click 'Choose File' and select the image(s) you want to upload.
- Submit the form to list your item for sale.
