#!/bin/bash

set -e

# Configuration
SOURCE_REPO="https://github.com/bcgov/nr-compliance-enforcement-cm.git"
DEST_REPO="https://github.com/bcgov/nr-compliance-enforcement.git"
SOURCE_DIR="nr-compliance-enforcement-cm"
DEST_DIR="nr-compliance-enforcement"
BRANCH="main"  # Adjust if needed
SERVICES=("migrations" "backend" "frontend")

# Temporary working directory
WORK_DIR=$(mktemp -d)
echo "Working in temporary directory: $WORK_DIR"

# Clone or pull source repo
if [ -d "$WORK_DIR/$SOURCE_DIR" ]; then
  echo "Pulling latest changes in $SOURCE_DIR"
  cd "$WORK_DIR/$SOURCE_DIR"
  git pull origin $BRANCH
else
  echo "Cloning $SOURCE_DIR"
  git clone --branch $BRANCH $SOURCE_REPO "$WORK_DIR/$SOURCE_DIR"
fi

# Clone or pull destination repo
if [ -d "$WORK_DIR/$DEST_DIR" ]; then
  echo "Pulling latest changes in $DEST_DIR"
  cd "$WORK_DIR/$DEST_DIR"
  git pull origin $BRANCH
else
  echo "Cloning $DEST_DIR"
  git clone --branch $BRANCH $DEST_REPO "$WORK_DIR/$DEST_DIR"
fi

# Copy and rename services
for SERVICE in "${SERVICES[@]}"; do
  echo "Copying $SERVICE to $SERVICE-cm"
  rm -rf "$WORK_DIR/$DEST_DIR/$SERVICE-cm"
  cp -r "$WORK_DIR/$SOURCE_DIR/$SERVICE" "$WORK_DIR/$DEST_DIR/$SERVICE-cm"
done

# Commit and push changes to destination repo
cd "$WORK_DIR/$DEST_DIR"
git add .
if git diff --cached --quiet; then
  echo "No changes to commit"
else
  echo "Committing changes"
  git commit -m "Sync: Update *-cm services from nr-compliance-enforcement-cm"
  git push origin $BRANCH
  echo "Changes pushed to $DEST_REPO"
fi

# Clean up
echo "Cleaning up temporary directory"
rm -rf "$WORK_DIR"

echo "Sync completed successfully"