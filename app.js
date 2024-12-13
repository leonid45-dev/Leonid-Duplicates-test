const fs = require("fs");
const csv = require("csv-parser");
const { stringify } = require("csv-stringify");

function readContactsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const contacts = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        contacts.push({
          contactId: parseInt(data["contactID"]),
          firstName: data["name"],
          lastName: data["name1"],
          email: data["email"],
          zipCode: data["postalZip"],
          address: data["address"],
        });
      })
      .on("end", () => {
        resolve(contacts);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

function findDuplicates(contacts) {
  const matches = [];

  for (let i = 0; i < contacts.length; i++) {
    for (let j = i + 1; j < contacts.length; j++) {
      const accuracy = getMatchAccuracy(contacts[i], contacts[j]);
      if (accuracy !== "None") {
        matches.push({
          contactIdSource: contacts[i].contactId,
          contactIdMatch: contacts[j].contactId,
          accuracy: accuracy,
        });
      }
    }
  }

  return matches;
}

function getMatchAccuracy(contact1, contact2) {
  const exactMatch = contact1.email === contact2.email;
  const similarFirstNames =
    contact1.firstName.toLowerCase().charAt(0) ===
      contact2.firstName.toLowerCase().charAt(0) ||
    contact1.firstName.toLowerCase() === contact2.firstName.toLowerCase();

  const exactZipCode = contact1.zipCode === contact2.zipCode;
  const exactAddress = contact1.address === contact2.address;

  if (exactMatch && exactZipCode && exactAddress) {
    return "High";
  } else if (
    exactMatch ||
    (similarFirstNames && (exactZipCode || exactAddress))
  ) {
    return "Medium";
  } else if (similarFirstNames) {
    return "Low";
  }

  return "None";
}

function writeDuplicatesToCSV(matches, outputFilePath) {
  const outputData = matches.map((match) => ({
    ContactID_Source: match.contactIdSource,
    ContactID_Match: match.contactIdMatch,
    Accuracy: match.accuracy,
  }));

  stringify(outputData, { header: true }, (err, output) => {
    if (err) {
      console.error("Error writing to CSV:", err);
      return;
    }

    fs.writeFileSync(outputFilePath, output);
    console.log("Duplicates written to Output.csv");
  });
}

async function main() {
  try {
    const contacts = await readContactsFromCSV("./SampleCodecsv.csv");
    const duplicateMatches = findDuplicates(contacts);
    writeDuplicatesToCSV(duplicateMatches, "./Output.csv");
    // Output the results
  } catch (error) {
    console.error("Error reading the CSV file:", error);
  }
}

main();
