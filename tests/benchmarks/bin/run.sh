#!/bin/bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

(
    cd "${SCRIPT_DIR}" || exit

    cd ../

    TIMEFORMAT=%R

    COUNTS=(250 500 1000 2000 4000)

    cleanup() {
        rm -rf build/
        rm -rf posts/
    }

    for COUNT in "${COUNTS[@]}"; do
        cleanup

        mkdir -p posts/

        for i in $(seq 1 "${COUNT}"); do
            cp index.md "posts/${i}.md"
            cp index.mjs "posts/${i}.mjs"

            sed -i '' -e "s/index/posts\/${i}/g" "posts/${i}.mjs"
        done

        ITERATIONS=5

        TOTAL_TIME=0

        for i in $(seq 1 $ITERATIONS); do
            CURRENT_TIME=$({ time npm run build 2>&1 1>/dev/null; } 2>&1)

            TOTAL_TIME=$(echo "${TOTAL_TIME} + ${CURRENT_TIME}" | bc)
        done

        AVERAGE_TIME=$(echo "scale=3; ${TOTAL_TIME} / ${ITERATIONS}" | bc)

        echo "Average time to compile ${COUNT} markdown files: ${AVERAGE_TIME}s"
    done

    cleanup
)
