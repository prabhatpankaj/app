var rp = require("request-promise");
const functions = require("firebase-functions");

const EVENT_CREATED_TEMPLATE = "d-d400f667dadb444ba38a66f6dbd22b44";
const USER_REGISTERED_EVENT_TEMPLATE = "d-c94d4cf68b1a420999c5dab58a1ffea9";

const sendMailTemplate = async (to, data, templateId) => {
  var options = {
    method: "POST",
    url: "https://api.sendgrid.com/v3/mail/send",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + functions.config().sendgrid.key,
    },
    body: {
      personalizations: [
        {
          to,
          dynamic_template_data: data,
        },
      ],
      from: {
        email: "info@veertly.com",
        name: "Veertly",
      },
      reply_to: {
        email: "info@veertly.com",
        name: "Veertly",
      },
      template_id: templateId,
    },
    json: true,
  };

  await rp(options);
};

const sendEventCreatedMail = async (toEmail, toFirstName, eventLink, eventTitle) => {
  const data = {
    event_link: eventLink,
    event_title: eventTitle,
    recipient_name: toFirstName,
  };

  const toUser = [
    {
      email: toEmail,
      name: toFirstName,
    },
  ];
  await sendMailTemplate(toUser, data, EVENT_CREATED_TEMPLATE);

  if (process.env.GCLOUD_PROJECT === "veertly") {
    const toVeertly = [
      {
        email: "info@veertly.com",
        name: "Veertly",
      },
    ];
    await sendMailTemplate(toVeertly, data, EVENT_CREATED_TEMPLATE);
  }
};

const sendUserRegistered = async (toEmail, toFirstName, eventLink, eventTitle) => {
  const data = {
    event_link: eventLink,
    event_title: eventTitle,
    recipient_name: toFirstName,
  };

  const toUser = [
    {
      email: toEmail,
      name: toFirstName,
    },
  ];
  await sendMailTemplate(toUser, data, USER_REGISTERED_EVENT_TEMPLATE);

  if (process.env.GCLOUD_PROJECT === "veertly") {
    const toVeertly = [
      {
        email: "info@veertly.com",
        name: "Veertly",
      },
    ];
    await sendMailTemplate(toVeertly, data, USER_REGISTERED_EVENT_TEMPLATE);
  }
};

module.exports = {
  sendEventCreatedMail,
  sendUserRegistered,
};
