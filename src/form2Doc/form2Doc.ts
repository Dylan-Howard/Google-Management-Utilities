const inputFormId = '1cjxB_r2Ekr3S1CZRPmLfp0jC4Qm0BInc0FbzPx4dX1A';
const exportFolderId = '1UzQEr5AmN--sZr9IUh5WdKpiJEPe28it'

// @ts-ignore
const logForm = (form) => {
  Logger.log(form.title);
  Logger.log(form.items);
}

// @ts-ignore
const parseSingleItem = (item) => ({
  title: item.getTitle(),
  choices: undefined,
})

// @ts-ignore
const parseMultiItem = (item) => ({
  title: item.getTitle(),
  // @ts-ignore
  choices: item.getChoices().map((choice) => choice.getValue()),
})

// @ts-ignore
const parseItem = (item) => {
  const type = item.getType();
  Logger.log(type)
  if (type == 'CHECKBOX') { return parseMultiItem(item.asCheckboxItem()) }
  if (type == 'MULTIPLE_CHOICE') { return parseMultiItem(item.asMultipleChoiceItem()) }
  if (type == 'TEXT') { return parseSingleItem(item.asTextItem()) }
}

// @ts-ignore
const getFormElements = (form) => ({
  title: form.getTitle(),
  items: form.getItems().map(
    // @ts-ignore
    (item) => parseItem(item)
  ),
})

// @ts-ignore
const getDocFromForm = (formElements) => {
  const doc = DocumentApp.create(formElements.title)
  const body = doc.getBody();

  // @ts-ignore
  formElements.items.forEach((item) => {
    body.appendParagraph(item.title)
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);
    if (item.choices) {
      // @ts-ignore
      item.choices.forEach((choice) => body.appendListItem(choice))
    }
  })
}

const processFormConversion = () => {
  const formElements = getFormElements(
    FormApp.openById(inputFormId)
  );

  logForm(formElements);

  getDocFromForm(formElements);
}
