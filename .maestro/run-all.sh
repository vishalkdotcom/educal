#!/bin/bash
# =============================================================
# EduCal — Full Maestro E2E Test Runner
# =============================================================
# Prerequisites:
#   1. Emulator running: $ANDROID_HOME/emulator/emulator -avd Pixel_6a -no-audio &
#   2. Dev server running: bunx expo start --android --port 8081
#
# Usage:
#   bash .maestro/run-all.sh [suite]
#   Suites: all | onboarding | dashboard | navigation | edge-cases | full
# =============================================================

APP_ID="host.exp.exponent"
LOCAL_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "192.168.1.57")
SUITE="${1:-all}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

passed=0
failed=0
skipped=0
failed_tests=()

run_test() {
    local test_file="$1"
    local test_name=$(basename "$test_file" .yaml)

    echo -e "\n${YELLOW}▶ Running: ${test_name}${NC}"

    # Reset app state
    adb shell pm clear "$APP_ID" > /dev/null 2>&1

    # Relaunch app
    adb shell am start -a android.intent.action.VIEW \
        -d "exp://${LOCAL_IP}:8081" "$APP_ID" > /dev/null 2>&1

    # Wait for bundle + dismiss dev menu
    sleep 12
    adb shell input tap 540 1600 > /dev/null 2>&1
    sleep 2

    # Run the test
    if maestro test "$test_file" --env APP_ID="$APP_ID" 2>&1; then
        echo -e "${GREEN}✓ PASSED: ${test_name}${NC}"
        ((passed++))
    else
        echo -e "${RED}✗ FAILED: ${test_name}${NC}"
        ((failed++))
        failed_tests+=("$test_name")
    fi
}

echo "============================================================="
echo "  EduCal E2E Test Suite — ${SUITE}"
echo "============================================================="

case "$SUITE" in
    onboarding)
        for f in .maestro/onboarding/*.yaml; do run_test "$f"; done
        ;;
    dashboard)
        for f in .maestro/dashboard/*.yaml; do run_test "$f"; done
        ;;
    navigation)
        for f in .maestro/navigation/*.yaml; do run_test "$f"; done
        ;;
    edge-cases)
        for f in .maestro/edge-cases/*.yaml; do run_test "$f"; done
        ;;
    full)
        run_test ".maestro/full-e2e-flow.yaml"
        ;;
    all)
        # Run full E2E first as smoke test
        run_test ".maestro/full-e2e-flow.yaml"

        # Then individual suites
        for f in .maestro/onboarding/*.yaml; do run_test "$f"; done
        for f in .maestro/dashboard/*.yaml; do run_test "$f"; done
        for f in .maestro/navigation/*.yaml; do run_test "$f"; done
        for f in .maestro/edge-cases/*.yaml; do run_test "$f"; done
        ;;
    *)
        echo "Unknown suite: $SUITE"
        echo "Usage: bash .maestro/run-all.sh [all|onboarding|dashboard|navigation|edge-cases|full]"
        exit 1
        ;;
esac

echo ""
echo "============================================================="
echo "  RESULTS"
echo "============================================================="
echo -e "  ${GREEN}Passed: ${passed}${NC}"
echo -e "  ${RED}Failed: ${failed}${NC}"
total=$((passed + failed))
echo "  Total:  ${total}"

if [ ${#failed_tests[@]} -gt 0 ]; then
    echo ""
    echo -e "  ${RED}Failed tests:${NC}"
    for t in "${failed_tests[@]}"; do
        echo -e "    - ${t}"
    done
fi

echo "============================================================="
exit $failed
