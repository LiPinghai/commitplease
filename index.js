#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var chalk = require('chalk')

var validate = require('./lib/validate')
var sanitize = require('./lib/sanitize')

var root = path.join(path.resolve(__dirname, '../..'), 'package.json')
var options = fs.existsSync(root) && require(root).commitplease || {}

;(function () {
  var messageFile = path.resolve(process.cwd(), '.git/COMMIT_EDITMSG')
  var message = sanitize(fs.readFileSync(messageFile, 'utf8').toString())
  var errors = validate(message, options)
  if (errors.length) {
    console.error('Invalid commit message, please fix the following issues:\n')
    console.error(chalk.red('- ' + errors.join('\n- ')))
    console.error()
    console.error('Commit message was:')
    console.error()
    console.error(chalk.green(message))

    if (options.style === undefined || options.style === 'jquery') {
      console.error('\nSee https://bit.ly/jquery-guidelines')
    } else if (options.style === 'angular') {
      console.error('\nSee https://bit.ly/angular-guidelines')
    }

    process.exit(1)
  }
}())
