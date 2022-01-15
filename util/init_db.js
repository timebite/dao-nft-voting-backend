const { config, generateDefaultPassword } = require('../config/config');

const Admin = require('../models/Admins');

async function initAdmin() {
        try {
            const defaultEmail = config.default_email;
            const exist = await Admin.findOne({ email: defaultEmail });
            if(!exist) {
                console.log(`First Run : Creating admin user`);
                const password = await generateDefaultPassword()
                const newAdmin = new Admin({
                    name: 'Admin',
                    email: defaultEmail,
                    password: password,
                    god_mode: true
                });
                newAdmin.save();
            }
        } catch (error) {
            console.log(error);
            return false;
        }
        return true;
}

module.exports = {
    initAdmin
}