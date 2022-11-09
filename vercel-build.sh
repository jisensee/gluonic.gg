#!bin/bash

npm run check

if [[ $VECEL_GIT_COMMIT_REF == "main" ]] ; then
  npm run prisma:generate-prod
else
  npm run prisma:generate-preview
fi

npm run prisma:migrate-prod 
npm run build
