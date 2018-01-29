if [[ $# -eq 0 ]] ; then
    echo "run-mocha => TEST=true mocha --compilers js:babel-register --ui tdd --timeout 8000 ./test/index.js" && TEST=true mocha --compilers js:babel-register --ui tdd --timeout 8000 ./test/index.js
else
    echo "run-mocha => TEST=true mocha --compilers js:babel-register --ui tdd --timeout 8000 \"$@\"" && TEST=true mocha --compilers js:babel-register --ui tdd --timeout 8000 "$@"
fi
