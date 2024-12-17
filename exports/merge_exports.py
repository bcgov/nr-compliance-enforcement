# This script merges two CSV files based on the 'Record ID' column.
# Setup Instructions:
# 1. Ensure Python is installed and added to your system PATH.
# 2. Add the 'Scripts' directory from the Python installation to the PATH (for pip).
# 3. Install required packages by running: pip install pandas
# 4. Place 'Complaint_Export.csv' and 'Case_Export.csv' in the same folder as this script.
# 5. Run the script using: python merge_exports.py

import pandas as pd

def main():
    # Define filenames
    complaint_file = "complaints.csv"
    case_file = "cases.csv"
    output_file = "NatCom_Export.csv"
    merge_column = "Record ID" # CEEB = "Record ID" COS = "Complaint Identifier"

    try:
        # Load data from both files
        complaint_df = pd.read_csv(complaint_file)
        case_df = pd.read_csv(case_file)

        # Merge data on 'Record ID' with validation
        combined_df = pd.merge(complaint_df, case_df, on=merge_column, how="outer", validate="many_to_many")

        # Save the merged data to a new CSV file
        combined_df.to_csv(output_file, index=False)
        print(f"Data successfully merged into {output_file}")

    except FileNotFoundError as e:
        print(f"Error: {e}\nPlease ensure both files exist in the correct directory.")

if __name__ == "__main__":
    main()
