#!/bin/sh

# Get the token from Travis environment vars and build the bot URL:
BOT_URL="https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage"

# Set formatting for the message. Can be either "Markdown" or "HTML"
PARSE_MODE="HTML"

# Use built-in Travis variables to check if all previous steps passed:
if [ $TRAVIS_TEST_RESULT -ne 0 ]; then
    build_status="failed"
    build_color="red"
else
    build_status="succeeded"
    build_color="green"
fi

send_msg () {
    curl -s -X POST ${BOT_URL} -d chat_id=$TELEGRAM_CHAT_ID \
        -d text="$1" -d parse_mode=${PARSE_MODE}
}

# Send message to the bot with some pertinent details about the job
# Note that for Markdown, you need to escape any backtick (inline-code)
# characters, since they're reserved in bash
send_msg "
<div>Travis build <span style=\"color: ${build_color}\">*${build_status}!*</span></div>
<div>Repository:  <b>${TRAVIS_REPO_SLUG}</b></div>
<div>Branch:      <b>${TRAVIS_BRANCH}</b></div>
<div>Commit Msg:</div>
<div><i>${TRAVIS_COMMIT_MESSAGE}</i></div>
<div><a href=\"${TRAVIS_JOB_WEB_URL})\">[Job Log here]</a></div>
<div>--------------------------------------</div>
"
