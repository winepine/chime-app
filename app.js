const { ConsoleLogger } = require("amazon-chime-sdk-js");
const AWS = require("aws-sdk");
const { v4: uuid } = require("uuid");
const express = require("express");
const path = require("path");

const credentials = new AWS.Credentials({
  accessKeyId: "AKIA2GRP3G4SB6VHPDQZ",
  secretAccessKey: "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",
});
AWS.config.credentials = credentials;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));
var meetingResponse = {};
const chime = new AWS.Chime({ region: "us-east-1" });
chime.endpoint = new AWS.Endpoint("https://service.chime.aws.amazon.com");
var createMeeting = async (req, res) => {
  try {
    const meeting = await chime
      .createMeeting({
        ClientRequestToken: uuid(),
        MediaRegion: "us-east-1",
      })
      .promise();
    res.send(meeting);
  } catch (error) {
    res.status(500).send(error);
  }
};
var createAttendee = async (req, res) => {
  try {
    const attendee = await chime
      .createAttendee({
        MeetingId: req.params.id,
        ExternalUserId: uuid(),
      })
      .promise();
    res.send(attendee);
  } catch (error) {
    res.status(500).send(error);
  }
};

app.get("/createMeeting", async (req, res) => {
  await createMeeting(req, res);
});
app.get("/createAttendee/:id", async (req, res) => {
  await createAttendee(req, res);
});
//createMeeting()
app.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "public", "chime.html");
  res.sendFile(indexPath);
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
