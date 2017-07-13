const _ = require('underscore');

module.exports = {
    underscore: _,
    languages: {
        'en': 'English',
        'en-US': 'English (United States)',
        'es': 'Español',
        'es-419': 'Español (Latinoamérica)',
        'fr': 'Français',
        'fr-CA': 'Français (Canada)',
        'fr-FR': 'Français (France)',
    },
    l10nFn: _.identity
};
