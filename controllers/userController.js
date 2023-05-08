const User = require("../models/user");
const Team = require("../models/team");

const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");

// Display list of all users.
exports.user_list = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find({}, "user_id team first_name last_name")
    .sort({ team: 1 })
    .populate("team")
    .exec();
  res.render("user_list", { title: "User List", user_list: allUsers });
});

// Display detail page for a specific user.
exports.user_detail = asyncHandler(async (req, res, next) => {
  const [user] = await Promise.all([
    User.findById(req.params.id).populate('team').exec(),
  ]);

  if (user === null) {
    // No results.
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  res.render("user_detail", {
    title: "User Detail",
    user: user,
  });
});

// Display user create form on GET.
exports.user_create_get = asyncHandler(async (req, res, next) => {
  const [allTeams] = await Promise.all([
    Team.find().exec(),
  ]);
  res.render("user_create_form", {
    title: "Create User",
    teams: allTeams,
  });
});

// Handle user create on POST.
exports.user_create_post = [
  // Validate and sanitize fields.
  body("user_id")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("User ID must be specified.")
    .isAlphanumeric()
    .withMessage("User ID has non-alphanumeric characters."),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Password must be of minimum length 6."),  

  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlpha()
    .withMessage("First name has non-alphabetic characters."),

  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified.")
    .isAlpha()
    .withMessage("Last name has non-alphabetic characters."),

  body("email")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Invalid email."),

  body("mobile")
    .trim()
    .escape()
    .isLength({min:10, max:10})
    .withMessage("Invalid mobile number."),

  body("type"),

  body("team"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create User object with escaped and trimmed data
    const user = new User({
      user_id: req.body.user_id,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      mobile: req.body.mobile,
      type: req.body.type,
      team: req.body.team,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      const [allTeams] = await Promise.all([
        Team.find().exec(),
      ]);
      res.render("user_create_form", {
        title: "Create User",
        user: user,
        teams: allTeams,
        errors: errors.array(),
      });
      return;
    } else {
        const userExists = await User.findOne({ user_id: req.body.user_id }).exec(); 
        if (userExists) {
          res.redirect(userExists.url);
        } 
        else {
          // Data from form is valid.
          // Save user.
          await user.save();
          // Redirect to new user record.
          res.redirect(user.url);
        }
    }           
  }),
];

// Display user delete form on GET.
exports.user_delete_get = asyncHandler(async (req, res, next) => {
  const [user] = await Promise.all([
    User.findById(req.params.id).exec(),
  ]);
  if (user === null) {
    // No results.
    res.redirect("/dashboard/users");
  }
  res.render("user_delete", {
    title: "Delete User",
    user: user,
  });
});

// Handle user delete on POST.
exports.user_delete_post = asyncHandler(async (req, res, next) => {
  await User.findByIdAndRemove(req.body.user_id);
  res.redirect("/dashboard/users");
});

// Display user update form on GET.
exports.user_update_get = asyncHandler(async (req, res, next) => {
  const [user, allTeams] = await Promise.all([
    User.findById(req.params.id).exec(),
    Team.find().exec(),
  ]);
  if (user === null) {
    // No results.
    const err = new Error("user not found");
    err.status = 404;
    return next(err);
  }
  res.render("user_update_form", {
    title: "Update User",
    user: user,
    teams: allTeams,
  });
});

// Handle user update on POST.
exports.user_update_post = [
  // Validate and sanitize fields.

  body("email")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Invalid email."),

  body("mobile")
    .trim()
    .escape()
    .isLength({min:10, max:10})
    .withMessage("Invalid mobile number."),

  body("type"),

  body("team"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create User object with escaped and trimmed data
    const user = new User({
      _id: req.params.id,
      email: req.body.email,
      mobile: req.body.mobile,
      type: req.body.type,
      team: req.body.team,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      const [allTeams] = await Promise.all([
        Team.find().exec(),
      ]);
      res.render("user_update_form", {
        title: "Update User",
        user: user,
        teams: allTeams,
        errors: errors.array(),
      });
      return;
    } else {
      const theuser = await User.findByIdAndUpdate(req.params.id, user, {});
      // Redirect to user detail page.
      res.redirect(theuser.url);
    }           
  }),
];