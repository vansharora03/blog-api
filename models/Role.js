const mongoose = require('mongoose');

/** Specify a role schema */
const RoleScehma = new mongoose.Schema({
    name: String
});

// Utilize schema to export model
module.exports = mongoose.model('Role', RoleScehma);