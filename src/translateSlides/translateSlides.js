"use strict";
exports.__esModule = true;
// @ts-ignore
var duplicateFile = function (fileId, duplicateDestination, _a) {
    var prefix = _a.prefix, suffix = _a.suffix;
    return (DriveApp.getFileById(fileId)
        .makeCopy([prefix, DriveApp.getFileById(fileId).getName(), suffix].join(''), duplicateDestination));
};
var languages = {
    Arabic: 'ar',
    Bosnian: 'bs',
    English: 'en',
    Farsi: 'fa',
    French: 'fr',
    Spanish: 'es'
};
var main = function () {
    var TARGET_ID = '1aBIPPbrIXGkwQqbk2U7oURxDiqBU-koROjHDbo2QKpY';
    // const TARGET_DESTIONATION_ID = '1VektNMkQEO8hXNrKIfWzsI5K8eR56Lqv';
    var TARGET_DESTIONATION_ID = DriveApp.getFileById(TARGET_ID)
        .getParents()
        .next()
        .getId();
    var TARGET_LANGUAGE = 'Spanish';
    var SOURCE_LANGUAGE = 'English';
    var TARGET_PREFIX_SUFFIX = {
        prefix: "".concat(TARGET_LANGUAGE, " - "),
        suffix: ''
    };
    var duplicatePresentation = duplicateFile(TARGET_ID, DriveApp.getFolderById(TARGET_DESTIONATION_ID), TARGET_PREFIX_SUFFIX);
    Logger.log(duplicatePresentation.getId());
    SlidesApp.openById(duplicatePresentation.getId()).getSlides()
        .forEach(function (sld) { return sld.getPageElements()
        .forEach(function (elm) {
        if (elm.getPageElementType() !== SlidesApp.PageElementType.SHAPE) {
            return;
        }
        var textBox = elm.asShape().getText();
        var text = textBox.asString();
        textBox.replaceAllText(text, LanguageApp.translate(text, languages[SOURCE_LANGUAGE], languages[TARGET_LANGUAGE]));
    }); });
};
exports["default"] = { main: main };
