const Team = require("../models/team");
const User = require("../models/user");

const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");

// Display list of all teams.
exports.team_list = asyncHandler(async (req, res, next) => {
  const allTeams = await Team.find({}, "team_name description")
    .sort({ team_name: 1 })
    .exec();
  res.render("team_list", { title: "Team List", team_list: allTeams });
});

// Display detail page for a specific team.
exports.team_detail = asyncHandler(async (req, res, next) => {
  const [team, allUsers] = await Promise.all([
    Team.findById(req.params.id).exec(),
    User.find({ team: req.params.id }, "user_id first_name last_name").exec(),
  ]);
  if (team === null) {
    // No results.
    const err = new Error("Team not found");
    err.status = 404;
    return next(err);
  }
  res.render("team_detail", {
    title: "Team Detail",
    team: team,
    all_users: allUsers,
  });
});

// Display team create form on GET.
exports.team_create_get = asyncHandler(async (req, res, next) => {
  res.render("team_create_form", { title: "Create Team" });
});

// Handle team create on POST.
exports.team_create_post = [
  // Validate and sanitize the name field.
  body("team_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Team name must be specified")
    .isAlpha()
    .withMessage("Team name has non-alphabetic characters."),

  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Team description must be specified"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a team object with escaped and trimmed data.
    const team = new Team({ team_name: req.body.team_name, description: req.body.description });

    if (!errors.isEmpty()) {
    // There are errors. Render the form again with sanitized values/error messages.
      res.render("team_create_form", {
        title: "Create Team",
        team: team,
        errors: errors.array(),
      });
      console.log(errors);
      return;
    } else {
      // Data from form is valid.
      // Check if team with same name already exists.
      const teamExists = await Team.findOne({ name: req.body.team_name }).exec();
      if (teamExists) {
        // team exists, redirect to its detail page.
        res.redirect(teamExists.url);
      } else {
        await team.save();
        // New team saved. Redirect to team detail page.
        res.redirect(team.url);
      }
    }
  }),
];

// Display team delete form on GET.
exports.team_delete_get = asyncHandler(async (req, res, next) => {
// Get details of team 
  const [team] = await Promise.all([
    Team.findById(req.params.id).exec(),
  ]);
  if (team === null) {
    // No results.
    res.redirect("/dashboard/teams");
  }
  res.render("team_delete", {
    title: "Delete Team",
    team: team,
  });
});

// Handle team delete on POST.
exports.team_delete_post = asyncHandler(async (req, res, next) => {
  await Team.findByIdAndRemove(req.body.team_id);
  res.redirect("/dashboard/teams");
});

// Display team update form on GET.
exports.team_update_get = asyncHandler(async (req, res, next) => {
  const [team] = await Promise.all([
    Team.findById(req.params.id).exec(),
  ]);
  if (team === null) {
    // No results.
    const err = new Error("Team not found");
    err.status = 404;
    return next(err);
  }
  res.render("team_update_form", {
    title: "Update team",
    team: team,
  });
});

// Handle team update on POST.
exports.team_update_post = [
  // Validate and sanitize the name field.
  body("team_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Team name must be specified"),

  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Team description must be specified"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a team object with escaped and trimmed data.
    const team = new Team({ 
                            _id: req.params.id,
                            team_name: req.body.team_name, 
                            description: req.body.description 
                          });

    if (!errors.isEmpty()) {
    // There are errors. Render the form again with sanitized values/error messages.
      res.render("team_update_form", {
        title: "Create Team",
        team: team,
        errors: errors.array(),
      });
      console.log(errors);
      return;
    } else {
      const theteam = await Team.findByIdAndUpdate(req.params.id, team, {});
      // Redirect to team detail page.
      res.redirect(theteam.url);
    }
  }),
];
