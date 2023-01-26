//dependencies
const fs = require("fs");
const path = require("path");

//module scaffolding
const lib = {};

//base directory of the data folder
lib.basedir = path.join(__dirname, "/../.data/");

//write data to file
lib.create = (dir, file, data, callback) => {
  //open file for writing
  fs.open(
    lib.basedir + path + dir + file + ".json",
    "wx",
    (err, filDescriptor) => {
      // error back petter first err peram then others
      if (!err && filDescriptor /*reference*/) {
        //convert data to sting
        const stirngData = JSON.stringify(data);
        //write data to file and close
        fs.writeFile(filDescriptor, stirngData, "utf-8", (err1) => {
          if (!err1) {
            fs.close(filDescriptor, (err2) => {
              if (!err2) {
                callback(false);
              } else {
                callback("Error writing to new file");
              }
            });
          } else {
            callback("Error writing to new file");
          }
        });
      } else {
        callback("Couldn't create a new file, it may already exists!");
      }
    }
  ); // wx -> flag
};

//read data from file
lib.read = (dir, file, callback) => {
  fs.readFile(
    lib.basedir + path + dir + file + ".json",
    "utf-8",
    (err, data) => {
      callback(err, data);
    }
  );
};

//update existing file
lib.update = (dir, file, data, callback) => {
  //open file
  fs.open(
    lib.basedir + path + dir + file + ".json",
    "r+",
    (err, filDescriptor /*reference*/) => {
      if (!err && filDescriptor) {
        const stirngData = JSON.stringify(data);

        //truncate the file
        fs.ftruncate(filDescriptor, (err1) => {
          if (!err1) {
            //write to the file and close it
            fs.write(filDescriptor, stirngData, (err2) => {
              if (!err2) {
                fs.close(filDescriptor, (err3) => {
                  if (!err3) {
                    callback(false);
                  } else {
                    callback("Error closing file");
                  }
                });
              } else {
                callback("Error writing to file");
              }
            });
          } else {
            callback("Error truncating file");
          }
        });
      } else {
        console.log("Error updating, File may not exist.");
      }
    }
  );
};

//delete existing file
lib.delete = (dir, file, callback) => {
  //unlink file
  fs.unlink(lib.basedir + path + dir + file + ".json", (err) => {
    if (err) {
      callback(false);
    } else {
      callback("Error deleting file");
    }
  });
};

module.exports = lib;
