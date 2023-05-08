const express = require("express");
const router = express.Router();

// Require controller modules.
const ticket_controller = require("../controllers/ticketController");
const user_controller = require("../controllers/userController");
const team_controller = require("../controllers/teamController");

/// ticket ROUTES ///

// GET catalog home page.
router.get("/", ticket_controller.index);

// GET request for creating a ticket. NOTE This must come before routes that display ticket (uses id).
router.get("/ticket/create", ticket_controller.ticket_create_get);

// POST request for creating ticket.
router.post("/ticket/create", ticket_controller.ticket_create_post);

// GET request to delete ticket.
router.get("/ticket/:id/delete", ticket_controller.ticket_delete_get);

// POST request to delete ticket.
router.post("/ticket/:id/delete", ticket_controller.ticket_delete_post);

// GET request to update ticket.
router.get("/ticket/:id/update", ticket_controller.ticket_update_get);

// POST request to update ticket.
router.post("/ticket/:id/update", ticket_controller.ticket_update_post);

// GET request for one ticket.
router.get("/ticket/:id", ticket_controller.ticket_detail);

// GET request for list of all ticket items.
router.get("/tickets", ticket_controller.ticket_list);

/// user ROUTES ///

// GET request for creating user. NOTE This must come before route for id (i.e. display user).
router.get("/user/create", user_controller.user_create_get);

// POST request for creating user.
router.post("/user/create", user_controller.user_create_post);

// GET request to delete user.
router.get("/user/:id/delete", user_controller.user_delete_get);

// POST request to delete user.
router.post("/user/:id/delete", user_controller.user_delete_post);

// GET request to update user.
router.get("/user/:id/update", user_controller.user_update_get);

// POST request to update user.
router.post("/user/:id/update", user_controller.user_update_post);

// GET request for one user.
router.get("//user/:id", user_controller.user_detail);

// GET request for list of all users.
router.get("/users", user_controller.user_list);

/// team ROUTES ///

// GET request for creating a team. NOTE This must come before route that displays team (uses id).
router.get("/team/create", team_controller.team_create_get);

//POST request for creating team.
router.post("/team/create", team_controller.team_create_post);

// GET request to delete team.
router.get("/team/:id/delete", team_controller.team_delete_get);

// POST request to delete team.
router.post("/team/:id/delete", team_controller.team_delete_post);

// GET request to update team.
router.get("/team/:id/update", team_controller.team_update_get);

// POST request to update team.
router.post("/team/:id/update", team_controller.team_update_post);

// GET request for one team.
router.get("/team/:id", team_controller.team_detail);

// GET request for list of all team.
router.get("/teams", team_controller.team_list);

module.exports = router;