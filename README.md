# Code Overview  

This JavaScript code reads contact data from a CSV file, identifies potential duplicates based on specific criteria, and writes the results to an output CSV file. The code is organized into functions for clarity and maintainability.  

## Function Structure  

The code consists of the following key functions:  

- **`readContactsFromCSV`**: Reads contact data from a specified CSV file.  
- **`findDuplicates`**: Identifies potential duplicate contacts from the input data.  
- **`getMatchAccuracy`**: Evaluates the similarity between two contacts and assigns an accuracy score.  
- **`writeDuplicatesToCSV`**: Writes the results (duplicate matches) to an output CSV file.  
- **`main`**: Orchestrates the overall process of reading the data, finding duplicates, and writing the output.  

## Workflow  

1. **Read Contacts**: The `main` function initiates the process by calling `readContactsFromCSV`, which reads data from `SampleCodecsv.csv` and creates an array of contact objects.  

2. **Find Duplicates**: The `findDuplicates` function is invoked with the contact array. It uses a nested loop to compare each contact with every other contact, checking for similarities using `getMatchAccuracy`. Matches are stored in an array if they meet the criteria.  

3. **Write Results**: The results of the duplicate matches are then written to `Output.csv` using the `writeDuplicatesToCSV` function, which formats the data as CSV.  

4. **Error Handling**: The code includes error handling to report issues when reading the input CSV file or writing the output CSV file.  

## Function Responsibilities  

### 1. `readContactsFromCSV(filePath)`  

- **Purpose**: Reads contact information from a CSV file located at the specified file path.  
- **Process**:  
  - Initializes an empty array called `contacts`.  
  - Reads the CSV file using `fs.createReadStream` and pipes it through `csv-parser`.  
  - For each row of data, creates a contact object with properties like `contactId`, `firstName`, `lastName`, `email`, `zipCode`, and `address`. It adds each contact object to the `contacts` array.  
  - Once all data has been processed, resolves a promise with the complete array of contacts.  

### 2. `findDuplicates(contacts)`  

- **Purpose**: Identifies potential duplicate contacts among the provided contact records.  
- **Process**:  
  - Initializes an empty array called `matches`.  
  - Uses a nested loop to compare each contact with every other contact.  
  - Calls `getMatchAccuracy` for each pair to assess their similarity. If the accuracy is not "None," it records the contact IDs and their similarity score in the `matches` array.  
  - Finally, returns the array of matches.  

### 3. `getMatchAccuracy(contact1, contact2)`  

- **Purpose**: Evaluates the similarity between two contacts based on email, first names, zip codes, and addresses.  
- **Process**:  
  - Checks if the emails of both contacts match (exact match).  
  - Assesses the similarity of their first names (by the first letter or exact match).  
  - Compares their zip codes and addresses for equality.  
- **Returns an accuracy score**:  
  - **"High"**: If email, zip code, and address match.  
  - **"Medium"**: For partial matches (e.g., same email or similar first names with at least one other matching detail).  
  - **"Low"**: If only the first names are similar.  
  - **"None"**: If there are no similarities.  

### 4. `writeDuplicatesToCSV(matches, outputFilePath)`  

- **Purpose**: Writes the identified duplicates to a new CSV file.  
- **Process**:  
  - Takes the matches (array of potential duplicates) and the path for the output file as parameters.  
  - Maps the matches to a new format that includes columns for source contact ID, matching contact ID, and accuracy score.  
  - Uses the `stringify` method to convert the data into CSV format.  
  - Writes the resulting CSV data to `Output.csv` using `fs.writeFileSync` and logs a success message.  

### 5. `main()`  

- **Purpose**: Manages the overall process of the script.  
- **Process**:  
  - Calls `readContactsFromCSV` to retrieve contacts from the specified input file.  
  - Calls `findDuplicates` to identify potential duplicates.  
  - Calls `writeDuplicatesToCSV` to save the results to `Output.csv`.  
  - Handles any errors that may occur during these processes.