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

        ITERATIONS=3

        MIN_TIME=0

        for i in $(seq 1 "${ITERATIONS}"); do
            CURRENT_TIME=$({ time npm run build 2>&1 1>/dev/null; } 2>&1)

            if [[ "${MIN_TIME}" == 0 || "${CURRENT_TIME}" < "${MIN_TIME}" ]]; then
                MIN_TIME="${CURRENT_TIME}"
            fi
        done

        echo "Lowest/fastest time to compile ${COUNT} markdown files: ${MIN_TIME}s"
    done

    cleanup
)
