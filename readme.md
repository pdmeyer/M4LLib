# M4LLib

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.0.2-blue.svg)](https://github.com/pdmeyer/M4LLib/releases)

**M4LLib** is a utility library for Max for Live (M4L) operations. It aims to provide an easy-to-use interface to Ableton Live's Live API by defining common patterns in a single library of functions.

**Please note** this library is a work in progress! Things will change, so if you are relying on the library for production use, consider forking the repository. 

## Documentation
Please see the [documentation](docs/API.md) for a reference of the library's functions and a usage guide.

## Quick Start

### Prerequisites

- **Ableton Live** (version 12 or later)
- Basic understanding of JavaScript in Max

### Installation

1. **Clone** this repository (if you don't know what this means, scroll down)
2. **Copy** `lib/m4l-lib.js` to your Max for Live project OR to anywhere in your Max search path (e.g. ~/Documents/Max 9/Library/)
3. **Add Javascript** to your device using `v8`, `v8ui`, or `v8.codebox`
4. **Include** the library in your device using `require("m4l-lib.js")`

## Documentation

- **[API Documentation](docs/API.md)** - Complete method reference

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## Reporting Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/pdmeyer/M4LLib/issues) and include:

- **Description** of the problem
- **Steps** to reproduce
- **Expected** vs actual behavior
- **Environment** details (Max version, Live version, OS)

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

The MIT License is one of the most permissive open source licenses, allowing you to:
- Use the code commercially
- Modify the code
- Distribute the code
- Use it privately
- Sublicense the code