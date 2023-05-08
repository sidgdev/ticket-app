const mongoose = require("mongoose");
const { DateTime } = require("luxon");


const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  ticket_id: { type: String, required: true },
  description: { type: String, required: true },  
  date: { type: Date, default: Date.now() },
  assigned_team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
  status: {
    type: String,
    required: true,
    enum: ["assigned", "working", "pending", "closed"],
    default: "assigned"
  },
  level: {
    type: String,
    required: true,
    enum: ["very high", "high", "moderate", "low"],
    default: "low"
  },
  worklog: { type: [String] }
});

// Virtual for ticket's URL
TicketSchema.virtual("url").get(function () {
  return `/ticket/${this._id}`;
});

TicketSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

// Export model
module.exports = mongoose.model("Ticket", TicketSchema);
