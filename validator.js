/**
 * All validators are defined here!
 * Front-end can combine any of these base on their needs.
 */

'use strict'

// User's username should be >= 6
function usernameMinimalLength(s) {
    return s.length >= 6;
}

// User's username should be <= 36
function usernameMaximalLength(s) {
    return s.length <= 36;
}

// User's username contains 0-9A-Za-z and underscores only, we keep this simplicity to avoid encoding issues
function usernameValidCharset(s) {
    const r = /^([a-z0-9A-Z_]+)$/;
    return r.test(s);
}

// User's email address should be <= 256
function emailMaximalLength(s) {
    return s.length <= 256;
}

// User's email address's format should be correct
function validEmail(s) {
    const r = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return r.test(s);
}

// User's password should be >= 6
function userPasswordMinimalLength(s) {
    return s.length >= 6;
}

// User's password should be <= 256
function userPasswordMaximalLength(s) {
    return s.length <= 256;
}

// User's password must be printable ASCII
function userPasswordValidCharset(s) {
    const set = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    for (let x of s) {
        if (set.indexOf(x) === -1) {
            return false;
        }
    }
    return true;
}

// User's password question should be >= 6
function userPasswordQuestionMinimalLength(s) {
    return s.length >= 6;
}

// User's password question should be <= 256
function userPasswordQuestionMaximalLength(s) {
    return s.length <= 256;
}

// User's password question must be printable ASCII
function userPasswordQuestionValidCharset(s) {
    const set = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    for (let x of s) {
        if (set.indexOf(x) === -1) {
            return false;
        }
    }
    return true;
}

// User's answer for the password question should be >= 6
function userAnswerForPasswordQuestionMinimalLength(s) {
    return s.length >= 6;
}

// User's answer for the password question should be <= 256
function userAnswerForPasswordQuestionMaximalLength(s) {
    return s.length <= 256;
}

// User's answer for password question must be printable ASCII
function userAnswerForPasswordQuestionValidCharset(s) {
    const set = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    for (let x of s) {
        if (set.indexOf(x) === -1) {
            return false;
        }
    }
    return true;
}

// Group's name's minimum length >= 6
function groupNameMinimalLength(name) {
    return name.length >= 6;
}

// Group's name's maximum length <= 36
function groupNameMaximalLength(name) {
    return name.length <= 36;
}

// Group's name's should contain 0-9A-Za-z and underscores only
function groupNameValidCharset(name) {
    const r = /^([a-z0-9A-Z_]+)$/;
    return r.test(name);
}

// Pic's relative filename <= 256
function picRelativeFilenameMaximalLength(filename) {
    return filename.length <= 256;
}

// Pic's relative filename >= 9 (image/a.jpg)
function picRelativeFilenameMinimalLength(filename) {
    return filename.length >= 9;
}

// Portrait's relative filename <= 256
function portraitRelativeFilenameMaximalLength(filename) {
    return filename.length <= 256;
}

// Portrait's relative filename >= 14 (portrait/a.jpg)
function portraitRelativeFilenameMinimalLength(filename) {
    return filename.length >= 14;
}

// Each comment's length <= 512
function commentMaximalLength(comment) {
    return comment.length <= 512;
}

// No empty comment is allowed
function commentIsEmpty(comment) {
    return comment.trim().length === 0;
}

// Admin's username should be >= 6
function adminUsernameMinimalLength(s) {
    return s.length >= 6;
}

// Admin's username should be <= 36
function adminUsernameMaximalLength(s) {
    return s.length <= 36;
}

// Admin's username contains 0-9A-Za-z and underscores only, we keep this simplicity to avoid encoding issues
function adminUsernameValidCharset(s) {
    const r = /^([a-z0-9A-Z_]+)$/;
    return r.test(s);
}

