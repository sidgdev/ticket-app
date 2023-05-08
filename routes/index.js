var express = require('express');
var router = express.Router();

const ticket_controller = require("../controllers/ticketController");
const user_controller = require("../controllers/userController");
const team_controller = require("../controllers/teamController");

/* GET home page. */
router.get("/", function (req, res) {
  res.redirect("/dashboard");
});

// User routes
router.get("/user/:id", user_controller.user_detail);
router.get("/user/:id/delete", user_controller.user_delete_get);
router.post("/user/:id/delete", user_controller.user_delete_post);
router.get("/user/:id/update", user_controller.user_update_get);
router.post("/user/:id/update", user_controller.user_update_post);

// Ticket routes
router.get("/ticket/:id", ticket_controller.ticket_detail);
router.get("/ticket/:id/delete", ticket_controller.ticket_delete_get);
router.post("/ticket/:id/delete", ticket_controller.ticket_delete_post);
router.get("/ticket/:id/update", ticket_controller.ticket_update_get);
router.post("/ticket/:id/update", ticket_controller.ticket_update_post);

// Team routes
router.get("/team/:id", team_controller.team_detail);
router.get("/team/:id/delete", team_controller.team_delete_get);
router.post("/team/:id/delete", team_controller.team_delete_post);
router.get("/team/:id/update", team_controller.team_update_get);
router.post("/team/:id/update", team_controller.team_update_post);

module.exports = router;
