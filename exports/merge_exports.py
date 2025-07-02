# This script merges two CSV files based on the 'Record ID' column.
# Setup Instructions:
# 1. Ensure Python is installed and added to your system PATH.
# 2. Add the 'Scripts' directory from the Python installation to the PATH (for pip).
# 3. Install required packages by running: pip install pandas
# 4. Place 'complaints.csv' and 'cases.csv' in the same folder as this script.
# 5. Run the script using: python merge_exports.py

import pandas as pd

def main():
    # Define filenames
    complaint_file = "complaints.csv"
    case_file = "cases.csv"
    output_file = "NatCom_Export.csv"
    merge_column = "Record ID" # CEEB = "Record ID" COS = "Complaint Identifier"

    # Define date range (inclusive)
    start_date = pd.to_datetime("2025-04-01")
    end_date = pd.to_datetime("2025-06-30")

    try:
        # Load data from both files
        complaint_df = pd.read_csv(complaint_file)
        case_df = pd.read_csv(case_file)

         # Convert date columns to datetime
        complaint_df["Date Received"] = pd.to_datetime(complaint_df["Date Received"], errors='coerce')
        case_df["Date Action Taken"] = pd.to_datetime(case_df["Date Action Taken"], errors='coerce')

        # Merge data on 'Record ID' with validation
        combined_df = pd.merge(complaint_df, case_df, on=merge_column, how="outer", validate="many_to_many")

        # Filter rows where either date is within the range
        mask = (
            (combined_df["Date Received"].between(start_date, end_date, inclusive="both")) |
            (combined_df["Date Action Taken"].between(start_date, end_date, inclusive="both"))
        )
        filtered_df = combined_df[mask]

        # Save the filtered merged data to a new CSV file
        filtered_df.to_csv(output_file, index=False, encoding='utf-8-sig')
        print(f"Filtered data successfully merged into {output_file}")

    except FileNotFoundError as e:
        print(f"Error: {e}\nPlease ensure both files exist in the correct directory.")

if __name__ == "__main__":
    main()
