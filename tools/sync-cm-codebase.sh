#!/bin/bash

set -e

# Configuration
SOURCE_REPO="https://github.com/bcgov/nr-compliance-enforcement-cm.git"
DEST_REPO="https://github.com/bcgov/nr-compliance-enforcement.git"
SOURCE_DIR="nr-compliance-enforcement-cm"
DEST_DIR="nr-compliance-enforcement"
SERVICES=("migrations" "backend" "frontend")
DEST_BRANCH_PREFIX="sync-cm"
DEST_BRANCH="${DEST_BRANCH_PREFIX}-$(date +%Y%m%d)"
SOURCE_BRANCH_COMPLAINT="${1:-main}"
SOURCE_BRANCH_CM="${2:-main}"

# Validate source branch formats
if [[ ! "$SOURCE_BRANCH_COMPLAINT" =~ ^(main|release/.*)$ ]]; then
  echo "Error: SOURCE_BRANCH_COMPLAINT must be 'main' or start with 'release/' (e.g., release/2.1)"
  exit 1
fi
if [[ ! "$SOURCE_BRANCH_CM" =~ ^(main|release/.*)$ ]]; then
  echo "Error: SOURCE_BRANCH_CM must be 'main' or start with 'release/' (e.g., release/2.1)"
  exit 1
fi

# Temporary working directory
WORK_DIR=$(mktemp -d)
echo "Working in temporary directory: $WORK_DIR"

# Clone or pull source repo (nr-compliance-enforcement-cm)
if [ -d "$WORK_DIR/$SOURCE_DIR" ]; then
  echo "Pulling latest changes in $SOURCE_DIR from $SOURCE_BRANCH_CM"
  cd "$WORK_DIR/$SOURCE_DIR"
  git fetch origin
  git checkout "$SOURCE_BRANCH_CM"
  git pull origin "$SOURCE_BRANCH_CM"
else
  echo "Cloning $SOURCE_DIR with branch $SOURCE_BRANCH_CM"
  git clone --branch "$SOURCE_BRANCH_CM" "$SOURCE_REPO" "$WORK_DIR/$SOURCE_DIR"
fi

# Clone or pull destination repo (nr-compliance-enforcement)
if [ -d "$WORK_DIR/$DEST_DIR" ]; then
  echo "Pulling latest changes in $DEST_DIR from $SOURCE_BRANCH_COMPLAINT"
  cd "$WORK_DIR/$DEST_DIR"
  git fetch origin
  git checkout "$SOURCE_BRANCH_COMPLAINT"
  git pull origin "$SOURCE_BRANCH_COMPLAINT"
else
  echo "Cloning $DEST_DIR with branch $SOURCE_BRANCH_COMPLAINT"
  git clone --branch "$SOURCE_BRANCH_COMPLAINT" "$DEST_REPO" "$WORK_DIR/$DEST_DIR"
  cd "$WORK_DIR/$DEST_DIR"
  git checkout "$SOURCE_BRANCH_COMPLAINT"
fi

# Create new branch in destination repo
echo "Creating new branch $DEST_BRANCH"
git checkout -b "$DEST_BRANCH"

# Copy and rename services, excluding unwanted files
for SERVICE in "${SERVICES[@]}"; do
  echo "Copying $SERVICE to $SERVICE-cm"
  rm -rf "$WORK_DIR/$DEST_DIR/$SERVICE-cm"
  mkdir -p "$WORK_DIR/$DEST_DIR/$SERVICE-cm"
  rsync -a --exclude 'node_modules' --exclude '.git' --exclude '*.log' \
    "$WORK_DIR/$SOURCE_DIR/$SERVICE/" "$WORK_DIR/$DEST_DIR/$SERVICE-cm/"
done

# Commit changes
cd "$WORK_DIR/$DEST_DIR"
git add .
if git diff --cached --quiet; then
  echo "No changes to commit"
else
  echo "Committing changes"
  git commit -m "chore: Update all cm codes from nr-compliance-enforcement-cm ($SOURCE_BRANCH_CM)"
  echo "Pushing changes to $DEST_BRANCH"
  git push origin "$DEST_BRANCH"
  echo "Changes pushed to $DEST_REPO branch $DEST_BRANCH"
fi

# Clean up
echo "Cleaning up temporary directory"
rm -rf "$WORK_DIR"

echo "Sync completed successfully"