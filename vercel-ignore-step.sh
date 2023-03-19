#!/bin/bash

echo "VERCEL_ENV: $VERCEL_ENV"

if [[ "$VERCEL_ENV" == "production" ]]; then
	# Build can continue
	echo "Deployment: Production"
	echo "✅ - Build can proceed"
	exit 1
else
	echo "Deployment: Preview"

	currentbranch=$(git branch --show-current)
	if [[ "$currentbranch" == "staging" ]]; then
		# Build can continue
		echo "✅ - Staging branch. Build can proceed"
		exit 1
	else
		# Don't build
		echo "🛑 - Build cancelled"
		exit 0
	fi
fi
