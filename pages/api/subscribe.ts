import mailchimp from "@mailchimp/mailchimp_marketing";
import type { NextApiRequest, NextApiResponse } from "next";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER, // e.g., us1
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, firstName, lastName } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID ?? "",
      {
        email_address: email,
        status: "pending", // --- this will force confirmation
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      }
    );

    return res.status(201).json({ error: "" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
