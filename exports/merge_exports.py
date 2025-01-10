# This script merges two CSV files based on the 'Record ID' column.
# Setup Instructions:
# 1. Ensure Python is installed and added to your system PATH.
# 2. Add the 'Scripts' directory from the Python installation to the PATH (for pip).
# 3. Install required packages by running: pip install pandas
# 4. Place 'complaints.csv' and 'cases.csv' in the same folder as this script.
# 5. Run the script using: python merge_exports.py

import pandas as pd

def main():
    # Define constants
    complaint_file = "complaints.csv"
    case_file = "cases.csv"
    output_file = "NatCom_Export.csv"
    merge_column = "Record ID" # CEEB = "Record ID" COS = "Complaint Identifier"
    complaint_date_column = "Date Received"
    case_date_column = "Date Action Taken"

    # Define the date range for filtering
    start_date = pd.to_datetime("2024-10-01")  # Example start date
    end_date = pd.to_datetime("2024-12-31")  # Example end date

    try:
        # Load data from both files
        complaint_df = pd.read_csv(complaint_file)
        case_df = pd.read_csv(case_file)

        # Convert the date columns to datetime 
        complaint_df[complaint_date_column] = pd.to_datetime(complaint_df[complaint_date_column], errors='coerce')
        case_df[case_date_column] = pd.to_datetime(case_df[case_date_column], errors='coerce')

        # Merge data on 'Record ID' with validation
        combined_df = pd.merge(complaint_df, case_df, on=merge_column, how="outer", validate="many_to_many")

        # Filter the data based on the date range for both complaint and case dates
        filtered_df = combined_df[
            ((combined_df[complaint_date_column] >= start_date) & (combined_df[complaint_date_column] <= end_date)) |
            ((combined_df[case_date_column] >= start_date) & (combined_df[case_date_column] <= end_date))
        ]

        # Save the merged data to a new CSV file
        filtered_df.to_csv(output_file, index=False, encoding='utf-8-sig')
        print(f"Data successfully merged into {output_file}")

    except FileNotFoundError as e:
        print(f"Error: {e}\nPlease ensure both files exist in the correct directory.")

if __name__ == "__main__":
    main()
