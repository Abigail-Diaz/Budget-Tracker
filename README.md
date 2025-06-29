# Expense Tracker and Budget

## Description
A budget application that allows users to edit and add expenses. The application also provides users to see their expenses in a linear graph over the selected month. 
The graphs represent data for up to five months, plus the current month. The app also provides the list of expenses and a budget interface that displays
monthly expense data against budgeted amounts in each category.

## Installation Instructions

### Required runtime environment:
- If **Node.js** is not already installed: [Download](https://nodejs.org/en/download)

### Setup
1. Clone the repository    
`git clone [https://github.com/Abigail-Diaz/Budget-Tracker.git]`
    
2. Navigate to the project
`cd Budget-Tracker`
    
3. Install dependencies
`npm install`

# Server setup
Start the Vite development server:
`npm run dev`
This will provide a local URL.
(usually http://localhost:5173/)

## Connecting to Airtable

This project uses **Airtable** as its backend database to store transaction data and budget categories.

### 1. Airtable Setup

1. **Create an Airtable base**  
   Go to [https://airtable.com](https://airtable.com) and create a new base (or use an existing one).

2. **Create Two Tables**  
   Your base should have two tables:
   - `transactions`: for storing individual transaction records
   - `Budget_Categories`: for storing budget categories and limits

3. **Add Fields**  
   - `transactions` table should include:
     - `Date` (Date)
     - `Amount` (Number)
     - `Category` (Single select)
     - `Description` (Optional text)
   - `Budget_Categories` table should include:
     - `name` (Text)
     - `amount` (Number)

### 2. Import Data from CSV

You can import data using Airtable’s **CSV Import** feature:

- In each table, click the dropdown → "Import Data" → "CSV file"
- The CSV files are in the /data folder at the project root.
- Upload the appropriate CSV file on each corresponding table in the Airtable:
  - `transactions.csv`       (For testing and data visualization)
  - `Budget_Categories.csv` (Required since budget categories are not added by users)

### 3. Configure Environment Variables

Create a `.env.local` file in the root of your project based on the provided example:

```env
VITE_PAT=your_airtable_personal_access_token
VITE_BASE_ID=your_airtable_base_id
VITE_TABLE_TRANSACTIONS=transactions
VITE_TABLE_CATEGORIES=Budget_Categories
```
- VITE_PAT: Create a personal access token at https://airtable.com/account under Developer Hub > Tokens
- VITE_BASE_ID: Find this in your Airtable base’s URL (airtable.com/appXXXXXXXXXXXXXX/...)

