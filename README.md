Here's a refined version of your README content with better clarity and structure:  

---

# **copyGoogleForms**  
A TypeScript-based Google Forms clone built without any frameworks.  

## **Features**  
1. Displays a list of forms created by the admin, with options to edit and preview.  
2. Shows user-saved form entries with an option to delete.  
3. Enables form creation, preview, and saving.  
4. Provides a user form details table with a delete option.  

### **Incomplete Features**  
- **Dashboard Page:** Not implemented, but `savedUserDetails` can be used to generate graphs.  
- **Preview Navigation:** No option to return after clicking "Preview."  
- **Form Controls:** Reordering or deleting controls is not yet handled.  

## **User Roles: Admin & User**  
- The role is determined using the `isAdmin` key in local storage.  
  - **Admin (`"yes"`)** – Can create and edit forms.  
  - **User (`"no"`)** – Can only preview forms.  

## **Prerequisites**  
Before running the application, set the following keys in local storage:  
- `isAdmin`: `"yes"`  
- `formCounter`: `"0"`  
- `userId`: `"1"`  

## **Running the Application**  
1. Install dependencies:  
   ```sh  
   npm install  
   ```  
2. Start the application:  
   ```sh  
   npm run start  
   ```  

## **Architecture Overview**  
Two implementation approaches are provided:  

1. **Fully Customizable Approach** (Code in the `classes` folder)  
   - Not fully implemented.  
   - Business logic for form creation is partially in place.  

2. **Routing & Controllers Approach**  
   - Implements navigation between pages.  

### **Pages**  
- **Form Listing** – Displays all created forms.  
- **Create Form** – Allows form creation.  
- **Preview Page** – Displays a form preview.  
- **Dashboard Page** – Planned but not implemented.  

### **Core Idea**  
- Form structures are stored as HTML strings.  
- User-entered data is stored as an object with:  
  - **Key:** Control ID  
  - **Value:** Control input  
- This ensures form integrity even if controls are removed or reordered.  
