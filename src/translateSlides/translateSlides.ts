// @ts-ignore
const duplicateFile = (fileId: string, duplicateDestination: Drive.Folder, { prefix, suffix} : { prefix: string, suffix: string }): Drive.File => (
  DriveApp.getFileById(fileId)
    .makeCopy(
      [ prefix, DriveApp.getFileById(fileId).getName(), suffix ].join(''),
      duplicateDestination,
    )
);

const getTextBoxesFromPresentation = (presentation: any) => {
  presentation.getSlides()
    .map((sld: any) => sld.getPageElements()
      .map((elm: any) => {
        if (elm.getPageElementType() !== SlidesApp.PageElementType.SHAPE) {
          return;
        }
        const textBox = elm.asShape().getText();
      })
    )
}

const languages = {
  Arabic: 'ar',
  Bosnian: 'bs',
  English: 'en',
  Farsi: 'fa',
  French: 'fr',
  Spanish: 'es',
};

const translateTextbox = (textBox, SOURCE_LANGUAGE: string, TARGET_LANGUAGE: string) => {
  const text = textBox.asString();
  textBox.replaceAllText(
    text,
    LanguageApp.translate(text, languages[SOURCE_LANGUAGE], languages[TARGET_LANGUAGE])
  )
}

const main = () => {
  const TARGET_ID = '1aBIPPbrIXGkwQqbk2U7oURxDiqBU-koROjHDbo2QKpY';
  const TARGET_DESTIONATION_ID = DriveApp.getFileById(TARGET_ID)
    .getParents()
    .next()
    .getId();
  const TARGET_LANGUAGE = 'Spanish';
  const SOURCE_LANGUAGE = 'English'
  const TARGET_PREFIX_SUFFIX = {
    prefix: `${TARGET_LANGUAGE} - `,
    suffix: '',
  };

  const duplicatePresentation = duplicateFile(
    TARGET_ID,
    DriveApp.getFolderById(TARGET_DESTIONATION_ID),
    TARGET_PREFIX_SUFFIX,
  );

  Logger.log(duplicatePresentation.getId());

  getTextBoxesFromPresentation(
    SlidesApp.openById(duplicatePresentation.getId())
  )
  // .forEach((textbox) => LanguageApp.)
  
};

export default { main };
