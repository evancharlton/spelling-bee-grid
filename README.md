# Spelling Bee Grid

A simple Chrome extension to augment the [New York Times'][nyt] fantastic [Spelling Bee] game.

## Installation

This is published to the [Chrome Web Store][cws] as the [Spelling Bee Grid][sbg] extension.
It can be installed for free with a few clicks.

## Development

To install this locally, start by cloning this repository:

```sh
git clone https://github.com/evancharlton/spelling-bee-grid
```

Then perform the following actions:

1. Clone the repo
1. Navigate to the extensions management page in [Chrome][chrome] (`chrome://extensions`)
   1. If you use [Edge][edge], use `edge://extensions`
1. Enable developer mode by flipping the toggle switch for "Developer mode" to the **enabled** position.
1. Load the unpacked extension:
   1. Click the button titled **Load unpacked**
   1. Choose the `crx/` folder within the `spelling-bee-grid` checkout

When you navigate to the [spelling bee], the extension should be automatically loaded.

PRs welcome!

[nyt]: https://nytimes.com
[spelling bee]: https://www.nytimes.com/puzzles/spelling-bee
[sbg]: https://chrome.google.com/webstore/detail/gfipmgpiamgpdnfcconjobelbkkfphkp
[cws]: https://chrome.google.com/webstore
[chrome]: https://chrome.google.com
[edge]: https://www.microsoft.com/en-us/edge
