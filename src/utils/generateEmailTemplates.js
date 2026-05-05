import handlebars from "handlebars";
import fs from "fs/promises"; // Use the promise-based version
import path from "path";

const _mainAppPath = path.resolve(import.meta.dirname, "..");

const generateEmailTemplates = async (template, data) => {
  try {
    const templatePath = path.join(
      _mainAppPath,
      "emails",
      "templates",
      template,
    );
    console.log(templatePath);
    const source = await fs.readFile(templatePath, "utf-8");
    let compiledTemplate = handlebars.compile(source);
    return compiledTemplate(data);
  } catch (err) {
     console.log(`there are error in making email template : ${err.message}`)
  }
};

export default generateEmailTemplates;
