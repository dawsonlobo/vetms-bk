"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionId = generateTransactionId;
exports.generatePassword = generatePassword;
exports.getObjectIdFromDate = getObjectIdFromDate;
exports.getDateFromObjectId = getDateFromObjectId;
exports.isCollectionEmpty = isCollectionEmpty;
exports.isDateValid = isDateValid;
exports.findJsonInJsonArray = findJsonInJsonArray;
exports.addJson = addJson;
exports.getImageFormat = getImageFormat;
var uniqid_1 = require("uniqid");
function generateTransactionId() {
  return (0, uniqid_1.default)("tx");
}
function generatePassword() {
  var pass = "";
  var str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";
  for (var i = 1; i <= 10; i++) {
    var char = Math.floor(Math.random() * str.length + 1);
    pass += str.charAt(char);
  }
  return pass;
}
function getObjectIdFromDate(date) {
  var objectId =
    Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
  return objectId;
}
function getDateFromObjectId(objectId) {
  var timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
  return new Date(timestamp);
}
function isCollectionEmpty(collectionName) {
  return !collectionName || collectionName.length === 0;
}
function isDateValid(date) {
  return date instanceof Date && !isNaN(date.valueOf());
}
function findJsonInJsonArray(list, value, keyToSearch) {
  for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
    var element = list_1[_i];
    if (element[keyToSearch] === value) {
      return true;
    }
  }
  return false;
}
function addJson(obj, key, value) {
  obj[key] = value;
  return obj;
}
function getImageFormat(buffer) {
  // Define known image format signatures
  var formatSignatures = [
    { signature: [0xff, 0xd8, 0xff], format: "jpeg" },
    { signature: [0x89, 0x50, 0x4e, 0x47], format: "png" },
    { signature: [0x47, 0x49, 0x46], format: "gif" },
    // Add more format signatures as needed
  ];
  // Compare the first few bytes of the buffer with known signatures
  for (
    var _i = 0, formatSignatures_1 = formatSignatures;
    _i < formatSignatures_1.length;
    _i++
  ) {
    var _a = formatSignatures_1[_i],
      signature = _a.signature,
      format = _a.format;
    if (
      signature.every(function (value, index) {
        return value === buffer[index];
      })
    ) {
      return format;
    }
  }
}
