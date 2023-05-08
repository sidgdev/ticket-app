const Team = require("../models/team");
const User = require("../models/user");
const Ticket = require("../models/ticket");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of teams, users and ticket counts (in parallel)
  const [
    numTeams,
    numUsers,
    numTickets,
  ] = await Promise.all([
    Team.countDocuments({}).exec(),
    User.countDocuments({}).exec(),
    Ticket.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Ticket Tracker",
    team_count: numTeams,
    user_count: numUsers,
    ticket_count: numTickets,
  });
});

// Display list of all tickets.
exports.ticket_list = asyncHandler(async (req, res, next) => {
  const allTickets = await Ticket.find({}, "ticket_id assigned_team date")
    .sort({ ticket_id: 1 })
    .populate("assigned_team")
    .exec();
  res.render("ticket_list", { title: "Ticket List", ticket_list: allTickets });
});

// Display detail page for a specific ticket.
exports.ticket_detail = asyncHandler(async (req, res, next) => {
  const [ticket] = await Promise.all([
    Ticket.findById(req.params.id).populate('assigned_team').exec(),
  ]);

  if (ticket === null) {
    // No results.
    const err = new Error("Ticket not found");
    err.status = 404;
    return next(err);
  }
  res.render("ticket_detail", {
    title: "Ticket Detail",
    ticket: ticket,
  });
});

// Display ticket create form on GET.
exports.ticket_create_get = asyncHandler(async (req, res, next) => {
  const [allTeams] = await Promise.all([
    Team.find().exec(),
  ]);
  res.render("ticket_create_form", {
    title: "Create Ticket",
    teams: allTeams,
  });
});

// Handle ticket create on POST.
exports.ticket_create_post = [
  // Validate and sanitize fields.
  body("ticket_id")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("ticket ID must be specified.")
    .isAlphanumeric()
    .withMessage("ticket ID has non-alphanumeric characters."),

  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description must be specified."),  

  body("level"),

  body("team"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create ticket object with escaped and trimmed data
    const ticket = new Ticket({
      ticket_id: req.body.ticket_id,
      description: req.body.description,
      level: req.body.level,
      assigned_team: req.body.team,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      const [allTeams] = await Promise.all([
        Team.find().exec(),
      ]);
      res.render("ticket_create_form", {
        title: "Create Ticket",
        ticket: ticket,
        teams: allTeams,
        errors: errors.array(),
      });
      return;
    } else {
        const ticketExists = await Ticket.findOne({ ticket_id: req.body.ticket_id }).exec(); 
        if (ticketExists) {
          res.redirect(ticketExists.url);
        } 
        else {
          // Data from form is valid.
          // Save ticket.
          await ticket.save();
          // Redirect to new ticket record.
          res.redirect(ticket.url);
        }
    }           
  }),
];

// Display ticket delete form on GET.
exports.ticket_delete_get = asyncHandler(async (req, res, next) => {
  const [ticket] = await Promise.all([
    Ticket.findById(req.params.id).exec(),
  ]);
  if (ticket === null) {
    // No results.
    res.redirect("/dashboard/tickets");
  }
  res.render("ticket_delete", {
    title: "Delete Ticket",
    ticket: ticket,
  });
});

// Handle ticket delete on POST.
exports.ticket_delete_post = asyncHandler(async (req, res, next) => {
  await Ticket.findByIdAndRemove(req.body.ticket_id);
  res.redirect("/dashboard/tickets");
});

// Display ticket update form on GET.
exports.ticket_update_get = asyncHandler(async (req, res, next) => {
  const [ticket, allTeams] = await Promise.all([
    Ticket.findById(req.params.id).exec(),
    Team.find().exec(),
  ]);
  if (ticket === null) {
    // No results.
    const err = new Error("ticket not found");
    err.status = 404;
    return next(err);
  }
  res.render("ticket_update_form", {
    title: "Update Ticket",
    ticket: ticket,
    teams: allTeams,
  });
});

// Handle ticket update on POST.
exports.ticket_update_post = [
  // Validate and sanitize fields. 

  body("level"),

  body("status"),

  body("team"),

  body("worklog")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("wWrklog must be specified."),  

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create ticket object with escaped and trimmed data
    const ticket = new Ticket({
      _id: req.params.id,
      level: req.body.level,
      status: req.body.status,
      assigned_team: req.body.team,
      worklog: req.body.worklog,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      const [allTeams] = await Promise.all([
        Team.find().exec(),
      ]);
      res.render("ticket_create_form", {
        title: "Create Ticket",
        ticket: ticket,
        teams: allTeams,
        errors: errors.array(),
      });
      return;
    } else {
      const theticket = await Ticket.findByIdAndUpdate(req.params.id, ticket, {});
      // Redirect to ticket detail page.
      res.redirect(theticket.url);
    }           
  }),
];

