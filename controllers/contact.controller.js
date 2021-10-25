const { required } = require('joi');
const joi = require('joi');
const Contact = require('../models/Contact');

exports.listContacts = async(req, res) => {
    try {
        let contacts = await Contact.find().populate('authorId');
        if (!contacts) {
            contacts = [];
        }
        res.status(200).json({
            message: "Contacts Fetched Successfully",
            contactData: contacts
        })
    } catch (err) {
        res.status(400).json({
            message: "Something went wrong",
            error: err
        })
    }
}

exports.createContact = async(req, res) => {

    const contactSchema = joi.object({
        authorId: joi.string(),
        ContactName: joi.string()
            .min(3)
            .max(30)
            .required(),
        ContactEmail: joi.string().required().email(),
        ContactPhone: joi.string().required().min(10).max(14),
        ContactType: joi.string().required().min(3)
    })

    try {
        console.log(req.body)
        let contactFields = await contactSchema.validateAsync(req.body);

        let phone = await Contact.findOne({ ContactPhone: contactFields.ContactPhone });
        let name = await Contact.findOne({ ContactName: contactFields.ContactName });
        if (!phone && !name) {
            contact = new Contact(contactFields);
            await contact.save();
            res.status(200).json({
                message: "Contact Saved Successfully",
                contact: req.body
            })
        } else if (name) {
            res.status(400).json({
                message: "Contact already exists"
            })
        } else if (phone) {
            res.status(400).json({
                message: "Contact with the same phone number already exists"
            })
        } else {
            res.status(400).json({
                message: "Contact with the same name already exists"
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Something went wrong",
            error: error
        })
    }
}
exports.updateContact = async(req, res) => {
    const id = req.params.id;
    const contactObj = {
        authorId: req.body.authorId,
        ContactName: req.body.ContactName,
        ContactEmail: req.body.ContactEmail,
        ContactPhone: req.body.ContactPhone,
        ContactType: req.body.ContactType
    }

    try {
        const updatedContact = await Contact.findByIdAndUpdate(id, { $set: contactObj });

        if (updatedContact == null) {
            res.status(400).json({
                message: "Contact didn't get Updated Successfully/ID not found"
            })
        } else {
            const updated = await Contact.findById(id);
            res.status(200).json({
                message: "Contact Updated Successfully",
                updatedContact: updated
            })
        }
    } catch (err) {
        res.status(400).json({
            message: "Something went wrong",
            error: err
        })
    }
}

exports.deleteContact = async(req, res) => {
    const id = req.params.id;
    try {
        const deletedContact = await Contact.findByIdAndDelete(id);
        if (deletedContact == null) {
            res.status(400).json({
                message: "Contact didn't get deleted Successfully/ID not found"
            })
        } else {
            res.status(200).json({
                message: "Contact deleted Successfully",
                deletedContact: deletedContact
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        })
    }

}
exports.getContactByID = async(req, res) => {
    const id = req.params.id
    try {
        const contact = await Contact.findById(id)
        if (contact) {
            res.status(200).json({
                message: "Contact Fetched",
                contacts: contact
            })
        } else {
            res.status(400).json({
                message: "Contact not found"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        })
    }

}

exports.getContactByName = async(req, res) => {
    const name = req.params.name
    try {
        const contact = await Contact.findOne({ ContactName: name })
        if (contact) {
            res.status(200).json({
                message: "Contact Fetched",
                contact: contact
            })
        } else {
            res.status(400).json({
                message: "Contact not found"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        })
    }

}

exports.getContactByPhone = async(req, res) => {

    const phone = req.params.phone
    try {
        const contact = await Contact.findOne({ ContactPhone: phone })
        if (contact) {
            res.status(200).json({
                message: "Contact Fetched",
                contact: contact
            })
        } else {
            res.status(400).json({
                message: "Contact not found"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        })
    }

}

exports.getContactByType = async(req, res) => {

    const type = req.params.type
    try {
        const contact = await Contact.find({ ContactType: type })
        if (contact) {
            res.status(200).json({
                message: "Contacts Fetched",
                contact: contact
            })
        } else {
            res.status(400).json({
                message: "Contact not found"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err
        })
    }

}

exports.getContactsByAuthor = async(req, res) => {

    try {
        const contacts = await Contact.find({ authorId: req.params.authorid }).populate('authorId');
        if (!contacts) {
            contacts = []
        } else {
            res.status(200).json({
                contacts: contacts
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        })
    }

}