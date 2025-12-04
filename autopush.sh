#!/bin/bash

while true; do
    clear
    echo "🔄 Surveillance de NexaSchool..."
    ls -1 | entr -d sh -c '
        git add .
        git commit -m "auto update"
        git push
        echo "✅ Pushed sur GitHub à $(date)"
    '
done
