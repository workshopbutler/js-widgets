"use strict";

module.exports = {
  "extends": "stylelint-config-standard",
  "customSyntax": "postcss-less",
  "rules": {
    "indentation": 2,
    "string-quotes": "double",
    "no-duplicate-selectors": true,
    "color-named": "never",
    "selector-combinator-space-after": "always",
    "selector-attribute-quotes": "always",
    "selector-attribute-operator-space-before": "never",
    "selector-attribute-operator-space-after": "never",
    "selector-attribute-brackets-space-inside": "never",
    "declaration-block-trailing-semicolon": "always",
    "declaration-colon-space-before": "never",
    "declaration-colon-space-after": "always",
    "function-url-quotes": "never",
    "font-family-name-quotes": "always-where-recommended",
    "comment-whitespace-inside": "always",
    "selector-pseudo-class-parentheses-space-inside": "never",
    "media-feature-range-operator-space-before": "always",
    "media-feature-range-operator-space-after": "always",
    "media-feature-parentheses-space-inside": "always",
    "media-feature-colon-space-before": "never",
    "media-feature-colon-space-after": "always",
    "color-hex-length": "short",
    "color-hex-case": "upper",
    "no-descending-specificity": null,
    "declaration-colon-newline-after": null,
    "font-family-no-missing-generic-family-keyword": null
  }
};
