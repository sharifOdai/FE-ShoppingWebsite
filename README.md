# FE-ShoppingWebsite

Welcome to the frontend documentation for my shopping website. This frontend is built using JavaScript and the React library, with additional support from Material-UI for styling.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------
Table of Contents
Project Structure
Components
States
Routing
Material-UI
Key Features

1. Project Structure
Our project follows a modular component-based structure. Key directories include:

src/components: Reusable React components.
src/pages: Higher-level components representing full pages of the application.
src/services: Services for handling API requests and managing global state.
src/styles: Global styles and theme configurations.

2. Components
Our components are designed for reusability and maintainability. Key components include:

Navbar: The main navigation bar with buttons for user actions and links to various pages.
ItemList: Displaying a grid of available items, with details such as title, photo, price, and stock.
SearchBar: Allowing users to search for specific items by name.
UserAuth: Handling user authentication, login, signup, and logout functionality.
FavoriteList: Displaying the user's favorite items, allowing addition and removal.
OrderList: Showing a list of orders for the logged-in user, including both pending and closed orders.
OrderProcess: Managing the process of adding/removing items in the pending order and proceeding to payment.
3. States
We use React states to manage dynamic data and user interactions. Global state management is achieved through React Context or Redux, ensuring consistency across components.

4. Routing
React Router is employed for client-side routing, allowing seamless navigation between pages. Routes are defined in src/App.js.

5. Material-UI
Material-UI is utilized for styling, providing a consistent and responsive user interface. It includes pre-designed components and themes for a modern look and feel.

6. Key Features
Authentication: Users can log in, sign up, and log out. Authentication is required for accessing the favorite list and order-related features.
Favorite List: Users can create, view, and manage their favorite list, persisting across sessions.
Order Management: Users can view and manage their orders, with the ability to add/remove items in the pending order and proceed to payment.
Stock Management: Items are displayed with real-time stock information, and users cannot order more items than available in stock.
Search: Users can search for specific items by name, with search results displayed dynamically.

Conclusion
This README provides an overview of the frontend project structure, key components, states, routing, Material-UI integration, and essential features of our shopping website. Refer to the source code for detailed implementation details.
