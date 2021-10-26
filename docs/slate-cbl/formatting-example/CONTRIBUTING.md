# How to Contribute

## General Guidelines

- Use an editor with an inline linter

## Commits

- Follow the [conventional commits](https://www.conventionalcommits.org) practice for all commits
- Every commit *should* represent a complete, working state for the system

## Branching and Pull Requests

- Push work to branches named `fixes/*` or `features/*`
- Open a pull request with the prefix `WIP: ` as soon as you first push a new branch
- When the PR is ready for merging, remove the `WIP: ` prefix and assign a reviewer

Additionally, for work based on a Trello card:

- Reference the card number in the branch name: `(fixes|features)/t24-some-issue`
- Record the name of the branch in the custom field for the Trello card
- If it's relevant, reference the card number in a commit message like this:

    ```console
    feat: add command to send managers open shift report (T125)
    ```

Or for work based on a DoneDone issue:

- Reference the issue number in the branch name: `fixes/d108-hotjar-siteid`
- If it's relevant, reference the card number in a commit message like this:

    ```console
    fix: write hotjar site ID directly into markup via shared include (D108)
    ```

## PHP Style Guide

- Follow PSR-1: https://www.php-fig.org/psr/psr-1/
- Follow PSR-2: https://www.php-fig.org/psr/psr-2/
- Follow PSR-4: https://www.php-fig.org/psr/psr-4/
- https://www.phpdoc.org/
- Avoid using `compact` to build arrays, as linters can't check that variable names are defined
- Attach authentication constraints to controllers, not to routes. Use [the `->except('...')` / `->only('...')` syntax](https://laravel.com/docs/5.7/controllers#controller-middleware) if auth needs to vary by method

### Auto-format PHP sources

This command will auto-format all `.php` files that your current branch adds, run it from the root of the repository:

```bash
php-cs-fixer fix --config=./.php_cs.dist `git diff --name-only --diff-filter=A origin/develop HEAD | grep '.php'`
```

## JavaScript Style Guide

- Use ES6 syntax
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Follow the [Vue.js Style Guide up to Priority C Rules (Recommended)](https://vuejs.org/v2/style-guide/#Priority-C-Rules-Recommended-Minimizing-Arbitrary-Choices-and-Cognitive-Overhead)

### Auto-format JS sources

This command will auto-format all `.js` files that your current branch adds, run it from the root of the repository:

```bash
yarn run eslint --fix `git diff --name-only --diff-filter=A origin/develop HEAD | grep '.js'`
```

## Common Style Guide

**Configure your editor to lint in realtime based on [`.editorconfig`](./.editorconfig), [`.php_cs.dist`](./.php_cs.dist), and [`.eslintrc.js`](./.eslintrc.js)**

### Naming conventions

- Avoid abbreviations and Hungarian notation
- Aim for minimal but descriptive naming
- For consistency, refer to existing code and use same names or similar naming patterns
- Use camelCase
