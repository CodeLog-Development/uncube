[![Build and test](https://github.com/CodeLog-Development/uncube/actions/workflows/build_and_test.yml/badge.svg)](https://github.com/CodeLog-Development/uncube/actions/workflows/build_and_test.yml)

# [UnCube](https://uncube.codelog.co.za/)

## Description

UnCube is a speedcubing timer for the 21st century. As of right now, we are in BETA so most features are unstable or unimplemented.

## Distribution and versioning

UnCube is currently available as a Progressive Web App. This means that it is usable from within a browser as well as being installable on most devices (Android, iPhone, PC, etc).
The [BETA Version](https://uncube.codelog.co.za/) is currently the only version available.
As soon as UnCube enters the release phase a separate version will be acquisitioned for testing.

## Contributing

Please file a GitHub issue for any bugs/requests with the following naming scheme.

- Feature requests `[FEATURE] Some issue title`
- Bugs/useability issues `[ISSUE] Some bug title`

For developers wishing to contribute, please follow the guidelines set out in the [CONTRIBUTING](CONTRIBUTING.md) file.

## Data storage

User data is currently stored entirely within Google Firestore. The Firebase project containing the project does not have Google Analytics enabled.
UnCube uses a single session cookie to keep users logged in across browsing sessions and page reloads. This functionality does not become available until the registration of an account.
In future a feature is planned for unregistered users to store their data within the browser's local storage.
